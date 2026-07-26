import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EMS Enterprise - Employee Management REST API Documentation',
      version: '1.0.0',
      description:
        'Comprehensive OpenAPI 3.0 Specification for EMS Enterprise. Features Admin & Employee authentication, attendance engine, breaks, holiday calendar, and leave approvals.',
      contact: {
        name: 'EMS Technical Team',
        email: 'support@ems.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Provide JWT Token in format: Bearer <your_jwt_token>',
        },
      },
      schemas: {
        LoginInput: {
          type: 'object',
          required: ['email', 'password', 'role'],
          properties: {
            email: { type: 'string', example: 'admin@ems.com' },
            password: { type: 'string', example: 'password123' },
            role: { type: 'string', enum: ['ADMIN', 'EMPLOYEE'], example: 'ADMIN' },
          },
        },
        EmployeeCreateInput: {
          type: 'object',
          required: ['name', 'email', 'department', 'designation'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'johndoe@ems.com' },
            password: { type: 'string', example: 'password123' },
            role: { type: 'string', enum: ['ADMIN', 'EMPLOYEE'], example: 'EMPLOYEE' },
            department: { type: 'string', example: 'Engineering' },
            designation: { type: 'string', example: 'Frontend Developer' },
            joiningDate: { type: 'string', example: '2026-07-25' },
            phone: { type: 'string', example: '+1 555-0199' },
          },
        },
        LeaveInput: {
          type: 'object',
          required: ['leaveType', 'startDate', 'endDate', 'reason'],
          properties: {
            leaveType: { type: 'string', enum: ['CASUAL', 'SICK', 'EARNED', 'UNPAID'], example: 'CASUAL' },
            startDate: { type: 'string', example: '2026-08-01' },
            endDate: { type: 'string', example: '2026-08-03' },
            reason: { type: 'string', example: 'Personal vacation trip' },
          },
        },
        HolidayInput: {
          type: 'object',
          required: ['title', 'date', 'type'],
          properties: {
            title: { type: 'string', example: 'Labor Day' },
            date: { type: 'string', example: '2026-09-07' },
            description: { type: 'string', example: 'Official holiday' },
            type: { type: 'string', enum: ['NATIONAL', 'COMPANY', 'OPTIONAL'], example: 'NATIONAL' },
          },
        },
      },
    },
    paths: {
      '/api/v1/auth/login': {
        post: {
          summary: 'User Sign-In (Admin & Employee)',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } },
          },
          responses: {
            200: { description: 'Login successful, returns JWT Access Token & Profile' },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/api/v1/auth/me': {
        get: {
          summary: 'Get Current Logged-in User Profile',
          tags: ['Authentication'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'User Profile Details' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/v1/admin/employees': {
        get: {
          summary: 'List All Employees (Admin Only)',
          tags: ['Admin Governance'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Filter by name/email/code' },
            { name: 'department', in: 'query', schema: { type: 'string' }, description: 'Filter by department' },
          ],
          responses: { 200: { description: 'Paginated employee list' } },
        },
        post: {
          summary: 'Create New Employee Account (Admin Only)',
          tags: ['Admin Governance'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/EmployeeCreateInput' } } },
          },
          responses: { 201: { description: 'Employee registered successfully' } },
        },
      },
      '/api/v1/attendance/check-in': {
        post: {
          summary: 'Employee Punch Check-In',
          tags: ['Attendance Engine'],
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Check-in recorded' } },
        },
      },
      '/api/v1/attendance/break/start': {
        post: {
          summary: 'Start Lunch/Tea Break',
          tags: ['Attendance Engine'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { breakType: { type: 'string', enum: ['LUNCH', 'SHORT_BREAK'], example: 'LUNCH' } },
                },
              },
            },
          },
          responses: { 200: { description: 'Break timer started' } },
        },
      },
      '/api/v1/attendance/break/end': {
        post: {
          summary: 'End Active Break & Resume Work',
          tags: ['Attendance Engine'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Break ended and duration calculated' } },
        },
      },
      '/api/v1/attendance/check-out': {
        post: {
          summary: 'Employee Punch Check-Out',
          tags: ['Attendance Engine'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Check-out recorded and total work hours computed' } },
        },
      },
      '/api/v1/holidays': {
        get: {
          summary: 'Get Company Holiday Calendar',
          tags: ['Holiday Calendar'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'List of holidays' } },
        },
      },
      '/api/v1/leaves': {
        post: {
          summary: 'Apply for Leave',
          tags: ['Leave Management'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LeaveInput' } } },
          },
          responses: { 201: { description: 'Leave application submitted' } },
        },
      },
      '/api/v1/leaves/admin/all': {
        get: {
          summary: 'View All Pending & Processed Leave Applications (Admin Only)',
          tags: ['Leave Management'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Leave requests list' } },
        },
      },
    },
  },
  apis: ['./routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
