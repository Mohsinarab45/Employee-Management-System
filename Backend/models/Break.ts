import { Schema, model, Document, Types } from 'mongoose';

export type BreakType = 'LUNCH' | 'SHORT_BREAK';

export interface IBreak extends Document {
  attendanceId: Types.ObjectId;
  userId: Types.ObjectId;
  breakType: BreakType;
  startTime: Date;
  endTime?: Date;
  durationMinutes: number;
}

const breakSchema = new Schema<IBreak>(
  {
    attendanceId: { type: Schema.Types.ObjectId, ref: 'Attendance', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    breakType: { type: String, enum: ['LUNCH', 'SHORT_BREAK'], default: 'LUNCH' },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    durationMinutes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Break = model<IBreak>('Break', breakSchema);
