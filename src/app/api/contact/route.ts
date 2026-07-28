import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const consultancySchema = z.object({
  type: z.literal("consultancy"),
  fullName: z.string().min(2, "Full name is required"),
  company: z.string().min(1, "Company is required"),
  email: z.string().email("Valid email is required"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const internshipSchema = z.object({
  type: z.literal("internship"),
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  college: z.string().min(2, "College is required"),
  whyJoin: z.string().min(10, "Please tell us why you want to join"),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const type = formData.get("type") as string;

    const resendApiKey = process.env.RESEND_API_KEY;
    const contactEmail =
      process.env.CONTACT_TO_EMAIL ||
      process.env.CONTACT_EMAIL ||
      "contact@aryancybersolutions.com";
    const fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      (process.env.FROM_EMAIL
        ? `Aryan Cyber Solutions <${process.env.FROM_EMAIL}>`
        : "Aryan Cyber Solutions <onboarding@resend.dev>");

    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { message: "Email service is not configured. Please contact us directly." },
        { status: 503 }
      );
    }

    const resend = new Resend(resendApiKey);

    if (type === "consultancy") {
      const data = {
        type: "consultancy" as const,
        fullName: String(formData.get("fullName") || ""),
        company: String(formData.get("company") || ""),
        email: String(formData.get("email") || ""),
        service: String(formData.get("service") || ""),
        message: String(formData.get("message") || ""),
      };

      const result = consultancySchema.safeParse(data);
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) errors[String(err.path[0])] = err.message;
        });
        return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
      }

      const { fullName, company, email, service, message } = result.data;

      await resend.emails.send({
        from: fromEmail,
        to: contactEmail,
        replyTo: email,
        subject: `Consultancy Inquiry — ${service}`,
        html: `
          <h2>New Consultancy Inquiry</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      });

      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: "We received your security consultation request",
        html: `
          <h2>Thank you, ${fullName}</h2>
          <p>We have received your consultation request regarding <strong>${service}</strong>.</p>
          <p>Our security team will review your inquiry and respond within 24 business hours.</p>
          <br>
          <p>Best regards,<br>Aryan Cyber Solutions Team</p>
        `,
      });
    } else if (type === "internship") {
      const resume = formData.get("resume") as File | null;

      if (!resume || resume.size === 0) {
        return NextResponse.json(
          { message: "Validation failed", errors: { resume: "Resume is required" } },
          { status: 400 }
        );
      }

      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(resume.type)) {
        return NextResponse.json(
          { message: "Validation failed", errors: { resume: "Only PDF and DOC files are accepted" } },
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
        college: String(formData.get("college") || ""),
        whyJoin: String(formData.get("whyJoin") || ""),
      };

      const result = internshipSchema.safeParse(data);
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) errors[String(err.path[0])] = err.message;
        });
        return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
      }

      const { fullName, email, college, whyJoin } = result.data;
      const resumeBuffer = Buffer.from(await resume.arrayBuffer());

      await resend.emails.send({
        from: fromEmail,
        to: contactEmail,
        replyTo: email,
        subject: `Internship Application — ${fullName}`,
        html: `
          <h2>New Internship Application</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>College:</strong> ${college}</p>
          <p><strong>Why Join Us:</strong></p>
          <p>${whyJoin.replace(/\n/g, "<br>")}</p>
          <p><em>Resume attached: ${resume.name}</em></p>
        `,
        attachments: [
          {
            filename: resume.name,
            content: resumeBuffer,
          },
        ],
      });

      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: "Your internship application has been received",
        html: `
          <h2>Thank you, ${fullName}</h2>
          <p>We have received your internship application from <strong>${college}</strong>.</p>
          <p>Our team will review your profile and resume, and get back to you shortly.</p>
          <br>
          <p>Best regards,<br>Aryan Cyber Solutions Team</p>
        `,
      });
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
