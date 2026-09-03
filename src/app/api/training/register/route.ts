import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { connectDB } from '@/lib/db';
import Candidate from '@/lib/models/Candidate';
import Assessment from '@/lib/models/Assessment';
import Counter from '@/lib/models/Counter';
import { companyInfo } from '@/lib/data';
import { rateLimit } from '@/lib/rate-limit';
import { createSessionToken } from '@/lib/session';

const registerSchema = z.object({
  fullName:       z.string().min(2, 'Full name is required'),
  personalEmail:  z.string().email('Valid personal email is required'),
  collegeEmail:   z.string().email('Valid college email is required'),
  collegeName:    z.string().min(3, 'College / institution name is required'),
  rollNumber:     z.string().min(1, 'Roll number is required'),
  phone:          z.string().regex(/^\+\d{11,15}$/, 'Enter a valid 10-digit mobile number'),
  yearOfStudy:    z.string().min(1, 'Year of study is required'),
  areaOfInterest: z.string().optional(),
});

function zodErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  error.errors.forEach((e) => {
    if (e.path[0]) out[String(e.path[0])] = e.message;
  });
  return out;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown-ip';
    
    // Configurable rate limit for dev/testing, production default 5
    const isDev = process.env.NODE_ENV !== 'production';
    const defaultLimit = isDev ? 50 : 5;
    const rateLimitMax = process.env.TRAINING_REGISTER_RATE_LIMIT 
      ? parseInt(process.env.TRAINING_REGISTER_RATE_LIMIT, 10) 
      : defaultLimit;
    
    const { success } = await rateLimit(`register_${ip}`, rateLimitMax, 3600);
    if (!success) {
      return NextResponse.json(
        { message: 'Too many registration attempts from this network. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: zodErrors(result.error) },
        { status: 400 }
      );
    }

    const {
      fullName, personalEmail, collegeEmail,
      collegeName, rollNumber, phone, yearOfStudy, areaOfInterest,
    } = result.data;

    if (personalEmail.toLowerCase() === collegeEmail.toLowerCase()) {
      return NextResponse.json(
        { message: 'Validation failed', errors: { collegeEmail: 'College email must differ from personal email' } },
        { status: 400 }
      );
    }

    await connectDB();

    const cohortYear = parseInt(process.env.TRAINING_COHORT_YEAR ?? String(new Date().getFullYear()), 10);

    // Duplicate check
    const existing = await Candidate.findOne({ personalEmail: personalEmail.toLowerCase(), cohortYear });
    if (existing) {
      return NextResponse.json(
        { message: 'An application already exists for this email address in the current cohort.', candidateId: existing.candidateId },
        { status: 409 }
      );
    }

    // Atomic candidate ID generation (with sync for existing DB)
    const counterId = `candidateId_${cohortYear}`;
    let candidateId = '';
    let retries = 0;
    while (retries < 100) {
      const counter = await Counter.findOneAndUpdate(
        { id: counterId },
        { $inc: { seq: 1 } },
        { returnDocument: 'after', upsert: true }
      );
      
      const currentSeq = counter ? counter.seq : 1;
      candidateId = `ACS-${cohortYear}-${String(currentSeq).padStart(6, '0')}`;
      const exists = await Candidate.exists({ candidateId });
      if (!exists) break;
      retries++;
    }

    // Save candidate
    const candidate = await Candidate.create({
      candidateId,
      fullName,
      personalEmail: personalEmail.toLowerCase(),
      collegeEmail: collegeEmail.toLowerCase(),
      collegeName,
      rollNumber,
      phone,
      yearOfStudy,
      areaOfInterest: areaOfInterest ?? '',
      cohortYear,
      registeredAt: new Date(),
      ipAddress: ip,
    });

    // Create an empty assessment record so we can track state
    await Assessment.create({ candidateId, completionStatus: 'in_progress' });

    // Generate JWT session token
    const token = await createSessionToken(candidateId);

    // Send confirmation email
    const resendApiKey = process.env.ACS_RESEND_API_KEY || process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const fromRaw = (process.env.ACS_RESEND_FROM_EMAIL ?? process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev').replace(/^["']|["']$/g, '');
      const angleMatch = fromRaw.match(/<([^>]+)>/);
      const fromAddr = angleMatch?.[1] ?? fromRaw;
      const from = `Aryan Cyber Solutions <${fromAddr}>`;

      await resend.emails.send({
        from,
        to: personalEmail,
        subject: `Registration Confirmed — Your Candidate ID: ${candidateId}`,
        html: `
          <p>Hello ${escapeHtml(fullName)},</p>
          <p>You have successfully registered for the Aryan Cyber Solutions Entry Assessment.</p>
          <p><strong>Your Candidate ID: <code>${escapeHtml(candidateId)}</code></strong></p>
          <p>Please save this ID — you will need it to access your assessment status.</p>
          <hr />
          <p><strong>Assessment Details</strong></p>
          <ul>
            <li>Duration: 45 minutes</li>
            <li>30 questions across 3 sections (Networks, Linux, Written Responses)</li>
            <li>Must be completed in a single session</li>
          </ul>
          <p>Once you are ready, return to the website and proceed to the Rules page to begin.</p>
          <br />
          <p>Regards,<br />Aryan Cyber Solutions<br />${escapeHtml(companyInfo.contactEmail)}</p>
        `,
      }).catch(() => { /* non-blocking — registration already saved */ });
    }

    // Set cookie and return success
    const response = NextResponse.json({ candidateId, fullName }, { status: 201 });
    response.cookies.set('acs_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 4 * 60 * 60, // 4 hours
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    console.error('[training/register]', error);
    // Handle MongoDB duplicate key error
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: number }).code === 11000) {
      return NextResponse.json(
        { message: 'An application already exists for this email address.' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
