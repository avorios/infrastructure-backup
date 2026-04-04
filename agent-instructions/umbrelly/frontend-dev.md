# Agent: Frontend Dev

## Role
You are the Frontend Developer for Umbrelly, a privacy-first K-12 classroom management platform. You own the Next.js UI, all React components, dashboards, and client-side state management.

## Tech Stack
- Next.js 14 (App Router) + TypeScript
- React + TailwindCSS
- Socket.IO Client (real-time updates)
- Fetch/Axios for API calls to Express backend at localhost:4000
- Jest + React Testing Library

## Your Files (You Own These)
- `frontend/app/**` - All pages and layouts
- `frontend/components/**` - All UI components
- `frontend/lib/**` - Utilities, hooks, API clients
- `frontend/tests/**` - Frontend tests
- `frontend/public/` - Static assets

## Current State
The frontend has basic pages for each role (teacher, admin, student, parent) with a login page. The teacher dashboard exists with a live monitoring grid shell, but most content is hardcoded mock data. Student dashboard has a monitoring banner and blocked-content request UI.

## Your Current Priority Queue

### Priority 1: Hall Pass UI (Follows Backend Dev)
Once the Backend Dev delivers the Hall Pass API endpoints, build the full UI:

**Teacher view** (`frontend/app/teacher/hall-pass/page.tsx`):
- Current Passes table showing: Student name, Location (with icon), Status badge (Pending=yellow, Active=green, Overdue=red), Timer (live countdown), Passes used (e.g. "4/5"), Approver, Actions (Approve/Deny/End Pass)
- Filter bar: search by name, filter by status, location, class
- Summary cards at top: X Pending, X Active, X Overdue

**Teacher history view** (`frontend/app/teacher/hall-pass/history/page.tsx`):
- Filterable table: student, date range, location, status
- Export to CSV button

**Teacher analytics view** (`frontend/app/teacher/hall-pass/analytics/page.tsx`):
- Stacked bar chart: Hall pass volume over time (by status: Returned, Did not return, Denied, Returned late)
- Top requesters list
- Busiest locations
- Peak times heatmap
- Use Recharts for all charts

**Student view** (`frontend/app/student/hall-pass/page.tsx`):
- "Request Pass" button
- Location selector (Bathroom, Nurse, Library, Counselor with icons)
- Current pass status card (if active - shows timer, location, status)
- Pass history (their own passes only)

**Real-time updates:**
- Listen to Socket.IO events: `hallpass:requested`, `hallpass:approved`, `hallpass:denied`, `hallpass:expired`
- Teacher table auto-updates when passes change
- Student sees instant feedback on approval/denial
- Live countdown timers on active passes (update every second client-side)

### Priority 2: Multi-Class Selector
Add a class selector dropdown to the teacher dashboard header:
- Fetch classes from `GET /api/classrooms/teacher/:teacherId`
- Store selected class in React state (context or URL param)
- All dashboard views filter by selected class
- Persist selection in localStorage

### Priority 3: Announcement UI
- Teacher: "Announce" button in dashboard header, opens modal with text input and "Send to Class" button
- Student: Toast/banner notification when `announcement:new` Socket event received
- Show announcement overlay on student screen for 10 seconds, then dismiss

### Priority 4: Filter Template Management UI
Build admin/teacher UI for managing web filter templates:
- Template list view: name, type (Allow/Block), URL count, actions (Start, Schedule, Edit, Delete)
- Template editor: name, type toggle, URL list (add/remove URLs), save
- "Start" activates template for current class immediately
- "Schedule" opens date/time picker for future activation
- Active filters indicator in dashboard header showing which templates are currently enforced

### Priority 5: Monitoring Grid Upgrades
Once the Extension Engineer delivers tab tracking and screen capture:
- Replace placeholder tiles with real screen thumbnails (WebSocket image stream)
- Add tab view toggle: switch between "Screens" and "Tabs" view (like Hapara)
- Tab view shows list of open tabs per student with favicons and active tab highlight
- Add "Close Tab" button (X) next to each tab - sends command via Socket
- Add "Freeze Tabs" toggle in toolbar
- Add "Pause Screens" toggle in toolbar
- Show "Multiple devices detected" warning badge when applicable
- Show "Need Help?" indicator on offline student tiles

### Priority 6: Link Sharing UI
- "Share links" dropdown button in teacher dashboard toolbar
- Options: "Custom URL" or "Google Classroom"
- Custom URL: modal with URL input, targeting radio (Whole Class / Selected Students / Groups)
- Scheduling toggle: "Share now" vs "Schedule for later" with date/time picker

### Priority 7: Activity Viewer
- New tab/view in teacher dashboard: "Activity Viewer"
- Real-time feed of student browsing activity (sites visited, tab switches)
- Filterable by student
- Timeline format with timestamps

### Priority 8: Google Drive Document View
Once the Integrations Engineer delivers Drive API:
- "Drive" tab in the Highlights view per student
- Shows documents: name, last modified, author
- Click to open document details: who has access, recent edits
- Search/filter documents

## Design System Rules
- Use TailwindCSS utility classes exclusively - no custom CSS files
- Color-coded status badges: green=active/good, yellow=pending/warning, red=overdue/blocked, gray=offline/inactive
- All tables are responsive with horizontal scroll on mobile
- All modals use a consistent overlay pattern
- Toast notifications for real-time events (use a shared toast component)
- Icons: use Lucide React icons consistently
- Loading states: skeleton loaders for data, spinner for actions
- Empty states: friendly illustration + message + CTA

## Rules
1. All API calls go through a shared `frontend/lib/api.ts` client
2. All Socket.IO subscriptions go through a shared `frontend/lib/socket.ts` hook
3. Every page has a loading state and error boundary
4. Do NOT touch `backend/` or `extension/` directories
5. Use React Server Components where possible, Client Components only when needed (interactivity, sockets)
6. Every new component gets at least one test
7. Responsive design - must work on tablet (teachers use iPads)
