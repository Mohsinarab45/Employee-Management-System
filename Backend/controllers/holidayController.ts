import { Request, Response } from 'express';
import { Holiday } from '../models/Holiday';
import { holidaySchema } from '../validators/schemas';

const DEFAULT_HOLIDAYS_2026 = [
  { title: "New Year's Day", date: '2026-01-01', description: 'Global official holiday for New Year', type: 'NATIONAL' },
  { title: 'Republic Day', date: '2026-01-26', description: 'National Republic Day Celebration', type: 'NATIONAL' },
  { title: 'Good Friday', date: '2026-04-03', description: 'Christian festival & public holiday', type: 'NATIONAL' },
  { title: 'International Labor Day', date: '2026-05-01', description: 'Celebrating workers & labor workforce', type: 'NATIONAL' },
  { title: 'EMS Annual Foundation Day', date: '2026-06-15', description: 'Company wide annual foundation event', type: 'COMPANY' },
  { title: 'Independence Day', date: '2026-08-15', description: 'National Independence Day celebration', type: 'NATIONAL' },
  { title: 'Mahatma Gandhi Jayanti', date: '2026-10-02', description: 'National holiday honoring Mahatma Gandhi', type: 'NATIONAL' },
  { title: 'Diwali Festival of Lights', date: '2026-11-08', description: 'Festival of Lights & cultural holiday', type: 'NATIONAL' },
  { title: 'EMS Innovation & Hackathon Day', date: '2026-11-25', description: 'Company optional innovation day', type: 'OPTIONAL' },
  { title: 'Christmas Day', date: '2026-12-25', description: 'Christmas global festival & holiday', type: 'NATIONAL' },
];

export const getHolidays = async (req: Request, res: Response): Promise<void> => {
  try {
    let holidays = await Holiday.find().sort({ date: 1 });
    
    // Auto-seed default official 2026 live calendar if collection is empty
    if (holidays.length === 0) {
      await Holiday.insertMany(DEFAULT_HOLIDAYS_2026);
      holidays = await Holiday.find().sort({ date: 1 });
    }

    res.status(200).json({ success: true, count: holidays.length, holidays });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createHoliday = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = holidaySchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, message: parseResult.error.issues[0].message });
      return;
    }

    const { title, date, description, type } = parseResult.data;

    const newHoliday = await Holiday.create({
      title,
      date,
      description,
      type,
    });

    res.status(201).json({ success: true, message: 'Holiday created', holiday: newHoliday });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteHoliday = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Holiday.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Holiday deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
