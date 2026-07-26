import { Request, Response } from 'express';
import { Leave } from '../models/Leave';
import { User } from '../models/User';
import { leaveSchema } from '../validators/schemas';
import { AuthRequest } from '../middleware/authMiddleware';

export const applyLeave = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const parseResult = leaveSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, message: parseResult.error.issues[0].message });
      return;
    }

    const { leaveType, startDate, endDate, reason } = parseResult.data;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newLeave = await Leave.create({
      userId: req.user.id,
      userName: req.user.name,
      userEmployeeId: req.user.employeeId,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
      status: 'PENDING',
    });

    res.status(201).json({ success: true, message: 'Leave application submitted', leave: newLeave });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyLeaves = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const leaves = await Leave.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: leaves.length, leaves });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllLeaves = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, search } = req.query;

    const activeEmployees = await User.find({ role: 'EMPLOYEE', status: 'ACTIVE' }).select('-passwordHash');
    const allLeaves = await Leave.find().sort({ createdAt: -1 });

    const activeLeaves: any[] = [];

    for (const emp of activeEmployees) {
      const empLeaves = allLeaves.filter(
        (l: any) => l.userId?.toString() === emp._id.toString() || l.userEmployeeId === emp.employeeId
      );

      if (empLeaves.length > 0) {
        empLeaves.forEach((l: any) => {
          activeLeaves.push({
            id: l._id,
            _id: l._id,
            userId: emp._id,
            userName: emp.name,
            userEmployeeId: emp.employeeId,
            leaveType: l.leaveType,
            startDate: l.startDate,
            endDate: l.endDate,
            totalDays: l.totalDays,
            reason: l.reason,
            status: l.status,
            adminComment: l.adminComment,
          });
        });
      } else {
        activeLeaves.push({
          id: `no_lve_${emp._id}`,
          _id: `no_lve_${emp._id}`,
          userId: emp._id,
          userName: emp.name,
          userEmployeeId: emp.employeeId,
          leaveType: 'N/A',
          startDate: '-',
          endDate: '-',
          totalDays: 0,
          reason: 'No leave request submitted',
          status: 'NO_REQUEST',
        });
      }
    }

    let filtered = activeLeaves;

    if (status && status !== 'ALL') {
      filtered = filtered.filter((l: any) => l.status === status);
    }

    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(
        (l: any) =>
          l.userName?.toLowerCase().includes(q) ||
          l.userEmployeeId?.toLowerCase().includes(q) ||
          l.reason?.toLowerCase().includes(q)
      );
    }

    res.status(200).json({ success: true, count: filtered.length, leaves: filtered });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLeaveStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, adminComment } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status' });
      return;
    }

    const leave = await Leave.findByIdAndUpdate(
      id,
      {
        status,
        adminComment,
        reviewedBy: req.user?.id,
      },
      { new: true }
    );

    if (!leave) {
      res.status(404).json({ success: false, message: 'Leave request not found' });
      return;
    }

    res.status(200).json({ success: true, message: `Leave ${status.toLowerCase()}`, leave });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
