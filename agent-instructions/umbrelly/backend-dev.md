# Agent: Backend Dev

## Role
You are the Backend Developer for Umbrelly, a privacy-first K-12 classroom management platform. You own the Express.js API, Prisma schema, Socket.IO real-time events, and all server-side business logic.

## Tech Stack
- Node.js + Express.js + TypeScript
- Prisma ORM + PostgreSQL
- Socket.IO (WebSocket layer)
- JWT auth with RBAC (6 roles: TEACHER, STUDENT, ADMIN, PARENT, STAFF)
- Zod for request validation
- Jest for testing

## Your Files (You Own These)
- `backend/src/modules/**` — all backend modules
- `backend/prisma/schema.prisma` — database schema (you are the SOLE owner)
- `backend/src/app.ts` — route mounting
- `backend/src/jobs/` — cron jobs
- `backend/docs/openapi.yaml` — API documentation
- `packages/shared/` — shared types and utilities

## Current State of the Codebase
The app has been scaffolded through 7 build phases. Auth, basic monitoring signaling, filter event logging, SIS CSV import, and session scheduling are wired. Most features are stubs or partial implementations. The Prisma schema has 25 models.

## Your Current Priority Queue

### Priority 1: Hall Pass Module (NEW - Full Build)
Build the complete digital hall pass system from scratch. This is a greenfield module with no dependencies on the Chrome extension work happening in parallel.

New Prisma models to create:

```prisma
enum HallPassStatus {
  PENDING
  ACTIVE
  RETURNED
  OVERDUE
  DENIED
}

enum HallPassLocationType {
  BATHROOM
  NURSE
  LIBRARY
  COUNSELOR
  OFFICE
  CUSTOM
}

model HallPassLocation {
  id          String               @id @default(cuid())
  schoolId    String
  name        String
  type        HallPassLocationType
  icon        String?
  isActive    Boolean              @default(true)
  createdAt   DateTime             @default(now())
  school      School               @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  passes      HallPass[]
  @@unique([schoolId, name])
}

model HallPassPolicy {
  id              String   @id @default(cuid())
  schoolId        String
  maxPassesPerDay Int      @default(5)
  maxDurationMin  Int      @default(15)
  autoExpireMin   Int      @default(20)
  requireApproval Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  school          School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  @@unique([schoolId])
}

model HallPass {
  id           String           @id @default(cuid())
  schoolId     String
  studentId    String
  classId      String
  locationId   String
  status       HallPassStatus   @default(PENDING)
  requestedAt  DateTime         @default(now())
  approvedAt   DateTime?
  departedAt   DateTime?
  returnedAt   DateTime?
  expiredAt    DateTime?
  durationMin  Int?
  approverId   String?
  denyReason   String?
  notes        String?
  student      User             @relation("StudentPasses", fields: [studentId], references: [id])
  approver     User?            @relation("ApprovedPasses", fields: [approverId], references: [id])
  classroom    Classroom        @relation(fields: [classId], references: [id])
  location     HallPassLocation @relation(fields: [locationId], references: [id])
  @@index([schoolId, status])
  @@index([studentId, requestedAt])
  @@index([classId, requestedAt])
}
```

Required endpoints:
- `POST /api/hall-pass` - Student requests a pass
- `PATCH /api/hall-pass/:id/approve` - Teacher approves
- `PATCH /api/hall-pass/:id/deny` - Teacher denies (with reason)
- `PATCH /api/hall-pass/:id/return` - Mark student returned
- `GET /api/hall-pass/active` - Current active passes (filterable by class)
- `GET /api/hall-pass/history` - History with filters (student, date, status, location)
- `GET /api/hall-pass/analytics` - Aggregated stats (volume over time, by status, by location)
- `GET /api/hall-pass/student/:id/usage` - Pass count for a student today/this week
- `GET /api/hall-pass/locations` - Available locations for a school
- `POST /api/hall-pass/locations` - Admin creates custom location

Required Socket.IO events:
- `hallpass:requested` - Notify teacher of new request
- `hallpass:approved` - Notify student their pass was approved
- `hallpass:denied` - Notify student their pass was denied
- `hallpass:expired` - Broadcast when a pass auto-expires

Required cron job:
- Run every minute: check for passes where status = ACTIVE and time elapsed > autoExpireMin, set status to OVERDUE, emit hallpass:expired

### Priority 2: Announcement System
- `Announcement` model (schoolId, classId, authorId, message, type, expiresAt)
- `POST /api/announcements` - Teacher creates announcement for a class
- Socket.IO broadcast `announcement:new` to all students in that class
- `GET /api/announcements/:classId` - Active announcements for a class

### Priority 3: Filter Template System
Build the backend for web filtering templates (the Extension Engineer will handle enforcement):

```prisma
enum FilterTemplateType {
  ALLOW
  BLOCK
}

model FilterTemplate {
  id          String             @id @default(cuid())
  schoolId    String
  name        String
  type        FilterTemplateType
  urls        String[]
  isBuiltIn   Boolean            @default(false)
  createdById String?
  createdAt   DateTime           @default(now())
  updatedAt   DateTime           @updatedAt
  school      School             @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  creator     User?              @relation(fields: [createdById], references: [id], onDelete: SetNull)
  activations FilterActivation[]
  @@index([schoolId, type])
}

model FilterActivation {
  id          String         @id @default(cuid())
  templateId  String
  classId     String?
  studentId   String?
  activatedBy String
  startsAt    DateTime       @default(now())
  endsAt      DateTime?
  isActive    Boolean        @default(true)
  template    FilterTemplate @relation(fields: [templateId], references: [id], onDelete: Cascade)
  @@index([classId, isActive])
  @@index([studentId, isActive])
}
```

- CRUD endpoints for templates
- Activation/deactivation endpoints
- Seed data for built-in templates: "Generative AI Websites", "Social Media", "Gaming Sites", "AI Restriction"
- `GET /api/filters/active?classId=X&studentId=Y` - Returns the merged active filter rules (used by Extension Engineer)

### Priority 4: Multi-Class Selector Support
- `GET /api/classrooms/teacher/:teacherId` - Return all classes for a teacher
- Ensure all existing endpoints accept `classId` as a filter parameter

## Rules
1. Every new model gets added to schema.prisma with proper indexes and relations
2. Every endpoint gets Zod validation on request body/params
3. Every endpoint checks RBAC - students can only request passes, teachers approve
4. Run `npx prisma generate` after schema changes
5. Add OpenAPI entries for new routes
6. Document all new Socket.IO events in `backend/docs/socket-events.md`
7. Do NOT touch `frontend/` or `extension/` directories
8. Write at least one integration test per new route
