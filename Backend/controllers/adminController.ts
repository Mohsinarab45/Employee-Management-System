import { Request, Response } from 'express';
import { User } from '../models/User';
import { Leave } from '../models/Leave';
import { Attendance } from '../models/Attendance';
import { Break } from '../models/Break';
import { employeeCreateSchema } from '../validators/schemas';

export const getEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, department, status } = req.query;

    const query: any = { role: 'EMPLOYEE' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
      ];
    }
    if (department && department !== 'ALL') {
      query.department = department;
    }
    if (status) {
      query.status = status;
    }

    const employees = await User.find(query).select('-passwordHash').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = employeeCreateSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: parseResult.error.issues[0].message,
      });
      return;
    }

    const { name, email, password, role, department, designation, joiningDate, phone } = parseResult.data;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email address already registered' });
      return;
    }

    const employeeId = `EMP-${Math.floor(100 + Math.random() * 900)}`;

    const newEmployee = await User.create({
      employeeId,
      name,
      email,
      passwordHash: password,
      role,
      department,
      designation,
      joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
      phone,
      status: 'ACTIVE',
    });

    res.status(201).json({
      success: true,
      message: 'Employee account created successfully',
      employee: {
        id: newEmployee._id,
        employeeId: newEmployee.employeeId,
        name: newEmployee.name,
        email: newEmployee.email,
        role: newEmployee.role,
        department: newEmployee.department,
        designation: newEmployee.designation,
        status: newEmployee.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    delete updateData.passwordHash; // Don't allow raw password update here

    const employee = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-passwordHash');
    if (!employee) {
      res.status(404).json({ success: false, message: 'Employee not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Employee profile updated', employee });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Cascading deletion of all records associated with this employee across all modules
    await Leave.deleteMany({ userId: id });
    await Attendance.deleteMany({ userId: id });
    await Break.deleteMany({ userId: id });

    const employee = await User.findByIdAndDelete(id);
    if (!employee) {
      res.status(404).json({ success: false, message: 'Employee not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Employee and all associated records deleted permanently' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
