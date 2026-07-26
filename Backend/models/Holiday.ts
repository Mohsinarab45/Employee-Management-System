import { Schema, model, Document } from 'mongoose';

export type HolidayType = 'NATIONAL' | 'COMPANY' | 'OPTIONAL';

export interface IHoliday extends Document {
  title: string;
  date: string; // YYYY-MM-DD
  description?: string;
  type: HolidayType;
}

const holidaySchema = new Schema<IHoliday>(
  {
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true, index: true },
    description: { type: String },
    type: { type: String, enum: ['NATIONAL', 'COMPANY', 'OPTIONAL'], default: 'NATIONAL' },
  },
  { timestamps: true }
);

export const Holiday = model<IHoliday>('Holiday', holidaySchema);
