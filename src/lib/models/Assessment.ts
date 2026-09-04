import mongoose, { Schema, Document, Model } from 'mongoose';

export type CompletionStatus = 'in_progress' | 'submitted' | 'timeout' | 'abandoned';
export type ReviewStatus = 'pending' | 'in_review' | 'completed';
export type FinalResult = 'pending' | 'admitted' | 'waitlisted' | 'rejected';

// ── Stored with full review context ──────────────────────────────────
export interface MCQAnswer {
  questionId: string;
  questionText: string;
  selectedOption: number;
  selectedText: string;    // the option text the candidate chose
  correctOption: number;
  correctText: string;     // the option text that was correct
  isCorrect: boolean;
  section: 'networks' | 'linux';
}

export interface WrittenAnswer {
  questionId: string;
  questionNumber: number;
  questionText: string;    // full question text so reviewer doesn't need to look it up
  response: string;
}

export interface IntegrityEvent {
  eventId?: string;
  type: 'tab_hidden' | 'tab_visible' | 'copy_attempt' | 'cut_attempt' | 'paste_attempt' | 'fullscreen_exit' | 'context_menu' | 'print_attempt' | 'save_attempt' | 'navigation_attempt' | 'drag_attempt' | 'screen_capture_attempt' | 'screenshot_shortcut_attempt' | 'integrity_strike' | 'fullscreen_grace_expired' | 'absence' | 'absence_returned' | 'grace_period_used';
  timestamp: string;
  durationMs?: number; // only for tab_hidden if applicable
}

export interface IAssessment extends Document {
  candidateId: string;
  startedAt: Date;
  submittedAt?: Date;
  completionStatus: CompletionStatus;
  // ── MCQ ──────────────────────────────
  mcqAnswers: MCQAnswer[];
  mcqScore?: number;           // total correct out of 20
  mcqScorePercent?: number;
  networksScore?: number;      // correct out of 10
  linuxScore?: number;         // correct out of 10
  // ── Written ──────────────────────────
  writtenAnswers: WrittenAnswer[];
  draftAnswers?: {
    mcq: Record<string, number>;
    written: Record<string, string>;
    savedAt: string;
  };
  // ── Review ───────────────────────────
  reviewStatus: ReviewStatus;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewerNotes?: string;
  finalResult: FinalResult;
  finalDecisionAt?: Date;
  integrityEvents?: IntegrityEvent[];
  tab_switch_count?: number;
  total_away_time_ms?: number;
  copy_attempt_count?: number;
  cut_attempt_count?: number;
  paste_attempt_count?: number;
  print_attempt_count?: number;
  save_attempt_count?: number;
  navigation_attempt_count?: number;
  drag_attempt_count?: number;
  fullscreen_exit_count?: number;
  screen_capture_attempt_count?: number;
  screenshot_shortcut_attempt_count?: number;
  fullscreen_grace_expired_count?: number;
  integrity_strike_count?: number;
  // ── Lock State ───────────────────────
  integrityStrikeCount?: number;
  integrityLockStatus?: 'none' | 'locked';
  integrityLockedAt?: Date;
  integrityLockReason?: string;
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    candidateId:      { type: String, required: true, unique: true, index: true },
    startedAt:        { type: Date },
    submittedAt:      { type: Date },
    completionStatus: { type: String, enum: ['in_progress', 'submitted', 'timeout', 'abandoned'], default: 'in_progress' },

    // Rich MCQ answers — reviewer can see exactly what was right/wrong
    mcqAnswers: [{
      questionId:     String,
      questionText:   String,
      selectedOption: Number,
      selectedText:   String,
      correctOption:  Number,
      correctText:    String,
      isCorrect:      Boolean,
      section:        String,
    }],
    mcqScore:         { type: Number },
    mcqScorePercent:  { type: Number },
    networksScore:    { type: Number },
    linuxScore:       { type: Number },

    // Written answers with full question text embedded
    writtenAnswers: [{
      questionId:     String,
      questionNumber: Number,
      questionText:   String,
      response:       String,
    }],

    draftAnswers:     { type: Schema.Types.Mixed },
    reviewStatus:     { type: String, enum: ['pending', 'in_review', 'completed'], default: 'pending' },
    reviewedBy:       { type: String },
    reviewedAt:       { type: Date },
    reviewerNotes:    { type: String },
    finalResult:      { type: String, enum: ['pending', 'admitted', 'waitlisted', 'rejected'], default: 'pending' },
    finalDecisionAt:  { type: Date },
    integrityEvents:  [{ type: Schema.Types.Mixed }],
    tab_switch_count: { type: Number, default: 0 },
    total_away_time_ms: { type: Number, default: 0 },
    copy_attempt_count: { type: Number, default: 0 },
    cut_attempt_count: { type: Number, default: 0 },
    paste_attempt_count: { type: Number, default: 0 },
    print_attempt_count: { type: Number, default: 0 },
    save_attempt_count: { type: Number, default: 0 },
    navigation_attempt_count: { type: Number, default: 0 },
    drag_attempt_count: { type: Number, default: 0 },
    fullscreen_exit_count: { type: Number, default: 0 },
    screen_capture_attempt_count: { type: Number, default: 0 },
    screenshot_shortcut_attempt_count: { type: Number, default: 0 },
    fullscreen_grace_expired_count: { type: Number, default: 0 },
    integrity_strike_count: { type: Number, default: 0 },
    integrityStrikeCount: { type: Number, default: 0 },
    integrityLockStatus: { type: String, enum: ['none', 'locked'], default: 'none' },
    integrityLockedAt: { type: Date },
    integrityLockReason: { type: String },
  },
  { timestamps: true }
);

const Assessment: Model<IAssessment> =
  mongoose.models.Assessment ?? mongoose.model<IAssessment>('Assessment', AssessmentSchema);

export default Assessment;

