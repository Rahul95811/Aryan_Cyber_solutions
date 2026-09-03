import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICandidate extends Document {
  candidateId: string;
  fullName: string;
  personalEmail: string;
  collegeEmail: string;
  collegeName: string;
  rollNumber: string;
  phone: string;
  yearOfStudy: string;
  areaOfInterest: string;
  cohortYear: number;
  registeredAt: Date;
  ipAddress?: string;
}

const CandidateSchema = new Schema<ICandidate>(
  {
    candidateId:     { type: String, required: true, unique: true },
    fullName:        { type: String, required: true, trim: true },
    personalEmail:   { type: String, required: true, lowercase: true, trim: true },
    collegeEmail:    { type: String, required: true, lowercase: true, trim: true },
    collegeName:     { type: String, required: true, trim: true },
    rollNumber:      { type: String, required: true, trim: true },
    phone:           { type: String, required: true, trim: true },
    yearOfStudy:     { type: String, required: true },
    areaOfInterest:  { type: String, default: '' },
    cohortYear:      { type: Number, required: true, default: () => new Date().getFullYear() },
    registeredAt:    { type: Date, required: true, default: () => new Date() },
    ipAddress:       { type: String },
  },
  { timestamps: false }
);

// Unique registration per personal email per cohort year
CandidateSchema.index({ personalEmail: 1, cohortYear: 1 }, { unique: true });

const Candidate: Model<ICandidate> =
  mongoose.models.Candidate ?? mongoose.model<ICandidate>('Candidate', CandidateSchema);

export default Candidate;
