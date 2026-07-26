import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { User } from './models/User';
import { Holiday } from './models/Holiday';
import { Attendance } from './models/Attendance';
import { Leave } from './models/Leave';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const seedDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ems_db';
    console.log(`[Seed] Connecting to MongoDB...`);
    await mongoose.connect(connStr);

    console.log(`[Seed] Clearing existing collections...`);
    await User.deleteMany({});
    await Holiday.deleteMany({});
    await Attendance.deleteMany({});
    await Leave.deleteMany({});

    console.log(`[Seed] Inserting initial Users...`);
    const admin = await User.create({
      employeeId: 'ADM-001',
      name: 'Sarah Connor',
      email: 'admin@ems.com',
      passwordHash: 'password123',
      role: 'ADMIN',
      department: 'Human Resources',
      designation: 'HR Director',
      joiningDate: new Date('2022-01-15'),
      status: 'ACTIVE',
    });

    const emp1 = await User.create({
      employeeId: 'EMP-101',
      name: 'Alex Mercer',
      email: 'alex@ems.com',
      passwordHash: 'password123',
      role: 'EMPLOYEE',
      department: 'Engineering',
      designation: 'Senior Frontend Engineer',
      joiningDate: new Date('2023-03-10'),
      status: 'ACTIVE',
    });

    const emp2 = await User.create({
      employeeId: 'EMP-102',
      name: 'Elena Rostova',
      email: 'elena@ems.com',
      passwordHash: 'password123',
      role: 'EMPLOYEE',
      department: 'Product & Design',
      designation: 'UI/UX Lead Designer',
      joiningDate: new Date('2023-06-01'),
      status: 'ACTIVE',
    });

    console.log(`[Seed] Inserting initial Holidays...`);
    await Holiday.insertMany([
      { title: 'New Year Day', date: '2026-01-01', description: 'Global holiday', type: 'NATIONAL' },
      { title: 'Independence Day', date: '2026-07-04', description: 'National holiday', type: 'NATIONAL' },
      { title: 'Company Foundation Day', date: '2026-09-12', description: 'Annual celebration', type: 'COMPANY' },
      { title: 'Thanksgiving Break', date: '2026-11-26', description: 'Company-wide holiday', type: 'NATIONAL' },
      { title: 'Christmas Celebration', date: '2026-12-25', description: 'End of year festivity', type: 'NATIONAL' },
    ]);

    console.log(`[Seed] Inserting initial Attendance...`);
    const todayIso = new Date().toISOString().split('T')[0];
    await Attendance.create({
      userId: emp1._id,
      userName: emp1.name,
      userEmployeeId: emp1.employeeId,
      date: todayIso,
      checkInTime: new Date(),
      totalWorkMinutes: 480,
      totalBreakMinutes: 45,
      status: 'PRESENT',
    });

    console.log(`[Seed] Inserting initial Leaves...`);
    await Leave.create({
      userId: emp2._id,
      userName: emp2.name,
      userEmployeeId: emp2.employeeId,
      leaveType: 'CASUAL',
      startDate: '2026-08-05',
      endDate: '2026-08-07',
      totalDays: 3,
      reason: 'Family vacation and personal travel',
      status: 'PENDING',
    });

    console.log(`==================================================`);
    console.log(`✅ Database Seeding Complete!`);
    console.log(`✅ Default Admin: admin@ems.com / password123`);
    console.log(`✅ Default Employee: alex@ems.com / password123`);
    console.log(`==================================================`);
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] Failed to seed database:`, error);
    process.exit(1);
  }
};

seedDB();
