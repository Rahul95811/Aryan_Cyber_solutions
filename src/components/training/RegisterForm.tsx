'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormState {
  status: 'idle' | 'loading' | 'error';
  message: string;
}

const inputClass =
  'type-body w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-cyber-500/50 placeholder-white/25';

const yearOptions = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Graduated / Working Professional',
];

const interestOptions = [
  'Network Security',
  'Ethical Hacking / Penetration Testing',
  'Digital Forensics',
  'SOC Operations',
  'Malware Analysis',
  'Cloud Security',
  'Web Application Security',
  'Governance, Risk & Compliance (GRC)',
  'Not sure yet',
];

function Field({
  label,
  name,
  type = 'text',
  error,
  required,
  autoComplete,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="type-label mb-1.5 block font-medium text-white/80">
        {label} {required && <span className="text-cyber-400">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`${inputClass} ${error ? 'border-red-400/50' : ''}`}
        suppressHydrationWarning
      />
      {error && <p className="type-label mt-1 text-red-400">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  error,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  options: string[];
  error?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="type-label mb-1.5 block font-medium text-white/80">
        {label} {required && <span className="text-cyber-400">*</span>}
      </label>
      <div className="relative flex items-center">
        <select
          id={name}
          name={name}
          required={required}
          defaultValue=""
          className={`${inputClass} appearance-none pr-10 ${error ? 'border-red-400/50' : ''}`}
          style={{ colorScheme: 'dark' }}
        >
          <option value="" disabled className="bg-navy-900 text-white/40">
            {placeholder ?? `Select ${label}`}
          </option>
          {options.map((o) => (
            <option key={o} value={o} className="bg-navy-900 text-white">
              {o}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-4 text-white/50">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="type-label mt-1 text-red-400">{error}</p>}
    </div>
  );
}

function PhoneField({ error }: { error?: string }) {
  const [localPhone, setLocalPhone] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\\D/g, ''); // Extract only digits
    
    // Auto-normalize if they pasted an Indian number with country code
    if (raw.length >= 12 && raw.startsWith('91')) {
      raw = raw.slice(2);
    } else if (raw.length >= 11 && raw.startsWith('0')) {
      raw = raw.slice(1);
    }
    
    // Bound the local digit length to exactly 10
    if (raw.length > 10) {
      raw = raw.slice(0, 10);
    }

    setLocalPhone(raw);
  };

  return (
    <div>
      <label htmlFor="phone" className="type-label mb-1.5 block font-medium text-white/80">
        Phone Number <span className="text-cyber-400">*</span>
      </label>
      <div className={`flex overflow-hidden rounded-lg border bg-white/5 transition-colors focus-within:border-cyber-500/50 ${error ? 'border-red-400/50' : 'border-white/10'}`}>
        <div className="relative flex items-center border-r border-white/10 bg-white/5">
          <select
            name="countryCode"
            defaultValue="+91"
            className="h-full cursor-pointer appearance-none bg-transparent pl-3 pr-7 text-white outline-none type-body"
            style={{ colorScheme: 'dark' }}
          >
            <option value="+91" className="bg-navy-900">IN (+91)</option>
            <option value="+1" className="bg-navy-900">US (+1)</option>
            <option value="+44" className="bg-navy-900">UK (+44)</option>
            <option value="+61" className="bg-navy-900">AU (+61)</option>
            <option value="+971" className="bg-navy-900">AE (+971)</option>
            <option value="+65" className="bg-navy-900">SG (+65)</option>
          </select>
          <div className="pointer-events-none absolute right-2 text-white/50">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          required
          autoComplete="tel-national"
          placeholder="98765 43210"
          className="type-body w-full bg-transparent px-4 py-3 text-white outline-none placeholder-white/25"
          pattern="[0-9]{10}"
          maxLength={10}
          minLength={10}
          title="Enter a 10-digit mobile number"
          value={localPhone}
          onChange={handleChange}
        />
      </div>
      {error && <p className="type-label mt-1 text-red-400">{error}</p>}
    </div>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({ status: 'idle', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setFormState({ status: 'loading', message: '' });

    const fd = new FormData(e.currentTarget);
    
    const countryCode = String(fd.get('countryCode') ?? '+91');
    let localPhone = String(fd.get('phone') ?? '').replace(/\D/g, '');
    
    let phone = '';
    if (localPhone) {
      if (countryCode === '+91') {
        phone = `+91${localPhone}`;
      } else {
        // Fallback for non-India
        phone = `${countryCode}${localPhone}`;
      }
    }

    const body = {
      fullName:       String(fd.get('fullName') ?? ''),
      personalEmail:  String(fd.get('personalEmail') ?? ''),
      collegeEmail:   String(fd.get('collegeEmail') ?? ''),
      collegeName:    String(fd.get('collegeName') ?? ''),
      rollNumber:     String(fd.get('rollNumber') ?? ''),
      phone:          phone,
      yearOfStudy:    String(fd.get('yearOfStudy') ?? ''),
      areaOfInterest: String(fd.get('areaOfInterest') ?? ''),
    };

    try {
      const res = await fetch('/api/training/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        setFormState({ status: 'error', message: data.message ?? 'Registration failed. Please try again.' });
        return;
      }

      // Store in sessionStorage as backup for navigation
      sessionStorage.setItem('acs_cid', data.candidateId);
      sessionStorage.setItem('acs_name', data.fullName);

      router.push(`/training/rules?cid=${encodeURIComponent(data.candidateId)}`);
    } catch {
      setFormState({ status: 'error', message: 'Network error. Please check your connection and try again.' });
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Personal Information */}
      <div className="mb-1">
        <p className="type-label font-semibold uppercase tracking-widest text-cyber-400">
          Personal Information
        </p>
        <div className="mt-1 h-px bg-cyber-500/20" />
      </div>

      <Field label="Full Name" name="fullName" error={errors.fullName} required autoComplete="name" placeholder="e.g. Arjun Sharma" />
      <Field label="Personal Email" name="personalEmail" type="email" error={errors.personalEmail} required autoComplete="email" placeholder="your@gmail.com" />
      <PhoneField error={errors.phone} />

      {/* Academic Information */}
      <div className="mb-1 mt-3">
        <p className="type-label font-semibold uppercase tracking-widest text-cyber-400">
          Academic Information
        </p>
        <div className="mt-1 h-px bg-cyber-500/20" />
      </div>

      <Field label="College / Institution Name" name="collegeName" error={errors.collegeName} required placeholder="e.g. GITAM University" />
      <Field label="College Email" name="collegeEmail" type="email" error={errors.collegeEmail} required placeholder="yourname@college.edu" />
      <Field label="Roll Number" name="rollNumber" error={errors.rollNumber} required placeholder="e.g. 21BCS1234" />
      <SelectField label="Year of Study" name="yearOfStudy" options={yearOptions} error={errors.yearOfStudy} required placeholder="Select year" />
      <SelectField label="Area of Interest" name="areaOfInterest" options={interestOptions} error={errors.areaOfInterest} placeholder="Select your interest (optional)" />

      {formState.status === 'error' && (
        <p className="type-label rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-red-400" role="alert">
          {formState.message}
        </p>
      )}

      <button
        type="submit"
        disabled={formState.status === 'loading'}
        className="btn-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {formState.status === 'loading' ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Registering...
          </span>
        ) : (
          'Register & Proceed to Rules'
        )}
      </button>

      <p className="type-label text-center text-white/35">
        Your information is stored securely and used only for this assessment.
      </p>
    </form>
  );
}
