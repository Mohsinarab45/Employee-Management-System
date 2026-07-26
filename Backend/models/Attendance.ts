import { Schema, model, Document, Types } from 'mongoose';

export type AttendanceStatus = 'PRESENT' | 'LATE' | 'HALF_DAY' | 'ABSENT' | 'ON_LEAVE';

export interface IAttendance extends Document {
  userId: Types.ObjectId;
  userName: string;
  userEmployeeId: string;
  date: string; // YYYY-MM-DD
  checkInTime: Date;
  checkOutTime?: Date;
  totalWorkMinutes: number;
  totalBreakMinutes: number;
  status: AttendanceStatus;
  ipAddress?: string;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userName: { type: String, required: true },
    userEmployeeId: { type: String, required: true },
    date: { type: String, required: true, index: true }, // Format: YYYY-MM-DD
    checkInTime: { type: Date, required: true },
    checkOutTime: { type: Date },
    totalWorkMinutes: { type: Number, default: 0 },
    totalBreakMinutes: { type: Number, default: 0 },
    status: { type: String, enum: ['PRESENT', 'LATE', 'HALF_DAY', 'ABSENT', 'ON_LEAVE'], default: 'PRESENT' },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

export const Attendance = model<IAttendance>('Attendance', attendanceSchema);
