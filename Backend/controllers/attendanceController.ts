import { Request, Response } from 'express';
import { Attendance } from '../models/Attendance';
import { Break } from '../models/Break';
import { AuthRequest } from '../middleware/authMiddleware';

export const checkIn = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const todayIso = new Date().toISOString().split('T')[0];

    // Check if already checked in today
    let record = await Attendance.findOne({ userId: req.user.id, date: todayIso });
    if (record) {
      res.status(400).json({ success: false, message: 'Already checked in for today' });
      return;
    }

    record = await Attendance.create({
      userId: req.user.id,
      userName: req.user.name,
      userEmployeeId: req.user.employeeId,
      date: todayIso,
      checkInTime: new Date(),
      status: 'PRESENT',
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Checked in successfully',
      attendance: record,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const startBreak = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { breakType } = req.body; // 'LUNCH' or 'SHORT_BREAK'
    const todayIso = new Date().toISOString().split('T')[0];

    const attendance = await Attendance.findOne({ userId: req.user.id, date: todayIso });
    if (!attendance) {
      res.status(400).json({ success: false, message: 'Must check in before taking a break' });
      return;
    }

    const newBreak = await Break.create({
      attendanceId: attendance._id,
      userId: req.user.id,
      breakType: breakType || 'LUNCH',
      startTime: new Date(),
    });

    res.status(200).json({
      success: true,
      message: `${breakType || 'Lunch'} break started`,
      breakRecord: newBreak,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const endBreak = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const activeBreak = await Break.findOne({
      userId: req.user.id,
      endTime: { $exists: false },
    }).sort({ createdAt: -1 });

    if (!activeBreak) {
      res.status(400).json({ success: false, message: 'No active break to end' });
      return;
    }

    const now = new Date();
    activeBreak.endTime = now;
    const durationMs = now.getTime() - activeBreak.startTime.getTime();
    activeBreak.durationMinutes = Math.floor(durationMs / (1000 * 60));
    await activeBreak.save();

    // Accumulate total break minutes in attendance
    await Attendance.findByIdAndUpdate(activeBreak.attendanceId, {
      $inc: { totalBreakMinutes: activeBreak.durationMinutes },
    });

    res.status(200).json({
      success: true,
      message: 'Break ended successfully',
      durationMinutes: activeBreak.durationMinutes,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkOut = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const todayIso = new Date().toISOString().split('T')[0];

    const attendance = await Attendance.findOne({ userId: req.user.id, date: todayIso });
    if (!attendance) {
      res.status(400).json({ success: false, message: 'No check-in record found for today' });
      return;
    }

    const now = new Date();
    attendance.checkOutTime = now;
    const totalMs = now.getTime() - attendance.checkInTime.getTime();
    attendance.totalWorkMinutes = Math.floor(totalMs / (1000 * 60)) - attendance.totalBreakMinutes;
    await attendance.save();

    res.status(200).json({
      success: true,
      message: 'Checked out successfully',
      attendance,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const records = await Attendance.find({ userId: req.user.id }).sort({ date: -1 });

    res.status(200).json({ success: true, count: records.length, attendance: records });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { date } = req.query;
    const query: any = {};
    if (date) {
      query.date = date;
    }

    const records = await Attendance.find(query).sort({ date: -1 });

    res.status(200).json({ success: true, count: records.length, attendance: records });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
