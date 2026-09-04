import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

/**
 * Email-only contact API — no database, no storage, no application history.
 * Resend is used solely to deliver admin notifications and acknowledgements.
 */
import { companyInfo } from "@/lib/data";
import { rateLimit } from "@/lib/rate-limit";

const BRAND_FROM_NAME = "Aryan Cyber Solutions";
const DEFAULT_FROM_ADDRESS = "onboarding@resend.dev";
const ADMIN_EMAIL = "contact@sriaryan.com";

function resolveFromAddress(): string {
  const raw = (process.env.ACS_RESEND_FROM_EMAIL || process.env.ACS_FROM_EMAIL || DEFAULT_FROM_ADDRESS)
    .trim()
    .replace(/^["']|["']$/g, "");

  const angleMatch = raw.match(/<([^>]+)>/);
  const address = (angleMatch?.[1] || raw).trim();

  if (address.includes("@")) {
    return `${BRAND_FROM_NAME} <${address}>`;
  }

  return `${BRAND_FROM_NAME} <${DEFAULT_FROM_ADDRESS}>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDateTime(date: Date): string {
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });
}

const contactSchema = z.object({
  type: z.literal("contact"),
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Phone number is required"),
  company: z.string().min(1, "Company is required"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const internshipSchema = z.object({
  type: z.literal("internship"),
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Phone number is required"),
  college: z.string().min(2, "College is required"),
  internship: z.string().min(1, "Please select an internship program."),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

function zodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  error.errors.forEach((err) => {
    if (err.path[0]) errors[String(err.path[0])] = err.message;
  });
  return errors;
}

export async function POST(request: NextRequest) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = (forwarded ? forwarded.split(',')[0].trim() : null) ??
      request.headers.get('x-real-ip') ??
      'unknown-ip';

    const limit = process.env.ACS_CONTACT_RATE_LIMIT
      ? parseInt(process.env.ACS_CONTACT_RATE_LIMIT, 10)
      : 30;

    const { success } = await rateLimit(`contact_${ip}`, limit, 3600);
    if (!success) {
      return NextResponse.json(
        { message: 'Too many contact requests from this network. Please try again later.' },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const type = String(formData.get("type") || "");

    const resendApiKey = process.env.ACS_RESEND_API_KEY;
    const adminEmail = process.env.ACS_CONTACT_TO_EMAIL || ADMIN_EMAIL;
    const fromEmail = resolveFromAddress();
    const submittedAt = formatDateTime(new Date());

    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { message: "Email service is not configured. Please contact us directly." },
        { status: 503 }
      );
    }

    const resend = new Resend(resendApiKey);

    if (type === "contact" || type === "consultancy") {
      const data = {
        type: "contact" as const,
        fullName: String(formData.get("fullName") || ""),
        email: String(formData.get("email") || ""),
        phone: String(formData.get("phone") || ""),
        company: String(formData.get("company") || ""),
        subject: String(formData.get("subject") || formData.get("service") || ""),
        message: String(formData.get("message") || ""),
      };

      const result = contactSchema.safeParse(data);
      if (!result.success) {
        return NextResponse.json(
          { message: "Validation failed", errors: zodErrors(result.error) },
          { status: 400 }
        );
      }

      const { fullName, email, phone, company, subject, message } = result.data;

      const notify = await resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        replyTo: email,
        subject: `New Contact Request - ${fullName}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
          <p><strong>Company:</strong> ${escapeHtml(company)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
          <p><strong>Date &amp; Time:</strong> ${escapeHtml(submittedAt)}</p>
        `,
      });

      if (notify.error) {
        console.error("Resend admin email error (contact):", notify.error);
        return NextResponse.json(
          { message: "Failed to send email. Please try again later.", detail: notify.error.message },
          { status: 502 }
        );
      }

      const ack = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: "Message Received - Aryan Cyber Solutions",
        html: `
          <p>Hello ${escapeHtml(fullName)},</p>
          <p>Thank you for contacting Aryan Cyber Solutions.</p>
          <p>We have successfully received your message regarding <strong>${escapeHtml(subject)}</strong>.</p>
          <p>Our team will review your inquiry and get back to you shortly.</p>
          <br>
          <p>Regards,</p>
          <p>
            Aryan Cyber Solutions<br>
            Visakhapatnam, India<br>
            ${escapeHtml(companyInfo.contactEmail)}
          </p>
        `,
      });

      if (ack.error) {
        console.error("Resend acknowledgement error (contact):", ack.error);
      }
    } else if (type === "internship") {
      const resume = formData.get("resume") as File | null;

      if (!resume || resume.size === 0) {
        return NextResponse.json(
          { message: "Validation failed", errors: { resume: "Resume (PDF) is required" } },
          { status: 400 }
        );
      }

      const isPdf =
        resume.type === "application/pdf" || resume.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        return NextResponse.json(
          { message: "Validation failed", errors: { resume: "Only PDF resumes are accepted" } },
          { status: 400 }
        );
      }

      if (resume.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { message: "Validation failed", errors: { resume: "File size must be under 5MB" } },
          { status: 400 }
        );
      }

      const data = {
        type: "internship" as const,
        fullName: String(formData.get("fullName") || ""),
        email: String(formData.get("email") || ""),
        phone: String(formData.get("phone") || ""),
        college: String(formData.get("college") || ""),
        internship: String(formData.get("internship") || ""),
        message: String(formData.get("message") || formData.get("whyJoin") || ""),
      };

      const result = internshipSchema.safeParse(data);
      if (!result.success) {
        return NextResponse.json(
          { message: "Validation failed", errors: zodErrors(result.error) },
          { status: 400 }
        );
      }

      const { fullName, email, phone, college, internship, message } = result.data;
      const resumeBuffer = Buffer.from(await resume.arrayBuffer());
      const resumeFilename = resume.name.toLowerCase().endsWith(".pdf")
        ? resume.name
        : `${resume.name}.pdf`;

      const notify = await resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        replyTo: email,
        subject: `New Internship Application - ${fullName}`,
        html: `
          <h2>New Internship Application</h2>
          <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone Number:</strong> ${escapeHtml(phone)}</p>
          <p><strong>College:</strong> ${escapeHtml(college)}</p>
          <p><strong>Selected Internship:</strong> ${escapeHtml(internship)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
          <p><strong>Date &amp; Time:</strong> ${escapeHtml(submittedAt)}</p>
          <p><em>Resume attached: ${escapeHtml(resumeFilename)}</em></p>
        `,
        attachments: [
          {
            filename: resumeFilename,
            content: resumeBuffer,
          },
        ],
      });

      if (notify.error) {
        console.error("Resend admin email error (internship):", notify.error);
        return NextResponse.json(
          { message: "Failed to send email. Please try again later.", detail: notify.error.message },
          { status: 502 }
        );
      }

      const ack = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: "Application Received - Aryan Cyber Solutions",
        html: `
          <p>Hello ${escapeHtml(fullName)},</p>
          <p>Thank you for applying to Aryan Cyber Solutions.</p>
          <p>We have successfully received your internship application.</p>
          <p>Our team will review your profile and contact you if you are shortlisted.</p>
          <p>Please allow 3–5 business days for review.</p>
          <br>
          <p>Regards,</p>
          <p>
            Aryan Cyber Solutions<br>
            Visakhapatnam, India<br>
            ${escapeHtml(companyInfo.contactEmail)}
          </p>
        `,
      });

      if (ack.error) {
        console.error("Resend acknowledgement error (internship):", ack.error);
      }
    } else {
      return NextResponse.json({ message: "Invalid form type" }, { status: 400 });
    }

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { message: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}
