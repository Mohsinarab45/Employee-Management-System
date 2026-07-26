import { Schema, model, Document, Types } from 'mongoose';

export type LeaveType = 'CASUAL' | 'SICK' | 'EARNED' | 'UNPAID';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ILeave extends Document {
  userId: Types.ObjectId;
  userName: string;
  userEmployeeId: string;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  adminComment?: string;
  reviewedBy?: Types.ObjectId;
}

const leaveSchema = new Schema<ILeave>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userName: { type: String, required: true },
    userEmployeeId: { type: String, required: true },
    leaveType: { type: String, enum: ['CASUAL', 'SICK', 'EARNED', 'UNPAID'], required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    totalDays: { type: Number, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    adminComment: { type: String },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Leave = model<ILeave>('Leave', leaveSchema);
