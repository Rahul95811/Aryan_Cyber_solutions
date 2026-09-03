import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICounter extends Document {
  id: string; // The sequence name, e.g., 'candidateId_2026'
  seq: number;
}

const CounterSchema = new Schema<ICounter>(
  {
    id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { timestamps: false }
);

const Counter: Model<ICounter> =
  mongoose.models.Counter ?? mongoose.model<ICounter>('Counter', CounterSchema);

export default Counter;
