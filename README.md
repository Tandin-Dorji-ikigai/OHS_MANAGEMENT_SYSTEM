# OHS Management System

Full-stack Occupational Health and Safety Management System for distributed field teams, field safety review, HQ oversight, and top-management dashboards.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- ORM: Sequelize
- Auth: JWT access token + refresh token persistence
- API: REST
- Uploads: Multer-backed photo/document uploads

## Current Delivery Scope

This repository is structured for phased delivery.

- Phase 1 implemented foundation:
  - Project setup
  - Auth and RBAC
  - User and site management
  - Inspection module
  - Incident module
  - Approval workflow foundation
  - Dashboard API
  - Notifications center
  - Attachment upload API
  - React application shell with role-aware navigation and module screens
- Phase 2 and Phase 3 modules implemented:
  - Risk assessments
  - Trainings
  - Toolbox meetings
  - OHS activities
  - OHS plans
  - Corrective actions

## Repository Structure

```text
backend/
  src/
    config/
    constants/
    controllers/
    database/
      migrations/
      masterData/
      scripts/
      seeders/
    docs/
    middleware/
    models/
    routes/
    services/
    utils/
    validators/
frontend/
  src/
    api/
    app/
    components/
    hooks/
    lib/
    pages/
    router/
    styles/
```

## Backend Modules

- `auth`: login, refresh, logout, profile
- `users`: list, create, update, role and site assignment
- `sites`: list, create, update
- `inspections`: list, detail, create, update, workflow transition, history
- `incidents`: list, detail, create, update, investigation, workflow transition, history
- `dashboard`: role-aware KPI summaries
- `notifications`: list and mark-as-read
- `attachments`: upload and list
- `risks`: list, detail, create, update, workflow transition, history
- `trainings`: list, detail, create, update, workflow transition, history
- `toolbox-meetings`: list, detail, create, update, workflow transition, history
- `activities`: list, detail, create, update, workflow transition, history
- `plans`: list, detail, create, update, workflow transition, history
- `actions`: list, detail, create, update, workflow transition, history

## Database Schema

Core tables:

- `roles`
- `users`
- `sites`
- `user_sites`
- `refresh_tokens`
- `notifications`
- `attachments`
- `approval_logs`
- `audit_logs`

Operational tables:

- `inspections`
- `inspection_items`
- `inspection_findings`
- `incidents`
- `incident_investigations`
- `risk_assessments`
- `risk_items`
- `trainings`
- `toolbox_meetings`
- `ohs_activities`
- `ohs_plans`
- `corrective_actions`

## Demo Users

All seeded users use password `Password@123`.

- `hq.safety@demo.local`
- `field.safety@demo.local`
- `supervisor@demo.local`
- `management@demo.local`

## Setup

### 1. Backend

```bash
cd backend
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Create the PostgreSQL database before running migrations:

```sql
CREATE DATABASE ohs_management;
```

Seed commands:

- `npm run db:seed:master`: inserts master data such as roles and sites
- `npm run db:seed:defaults`: inserts default users and sample operational records
- `npm run db:seed`: runs both master and default data loaders

The new seed scripts are idempotent and can be rerun safely because they upsert by fixed IDs.

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## API Base URL

`http://localhost:5000/api`

## Important Design Notes

- Workflow statuses are normalized across major modules.
- Approval actions are stored in `approval_logs`.
- Audit actions are stored in `audit_logs`.
- Site-based scoping is enforced for field roles.
- Only approved data should feed top-management analytics.
- Upload architecture is file-system backed now and can later move to object storage.
- Schema includes phase-ready entities for offline-sync metadata extension in later delivery.

## Immediate Next Build Steps

1. Expand frontend API integration to the remaining phase-one pages and module-specific evidence workflows.
2. Add OpenAPI annotations and broader automated test coverage.
3. Add production deployment manifests.
4. Add offline sync metadata tables and conflict-resolution strategy.






# OHS Frontend Integration Tasks

Project:
Enterprise OHS Management System Frontend

Stack:
- React + Vite
- Tailwind CSS
- Headless UI
- React Query
- Axios
- React Router

Current frontend architecture already exists.

IMPORTANT:
- Do NOT refactor existing UI unnecessarily
- Reuse existing architecture
- Follow existing folder structure
- Keep components reusable
- Keep styling consistent with current dark enterprise theme
- Avoid creating duplicate logic
- Avoid large rewrites
- Keep implementation modular

---

# STEP 1 — Authentication + Authorization

Implement production-grade auth system.

Tasks:
- Create auth context
- Persist JWT access token
- Handle refresh token flow
- Create protected routes
- Create role-based route guards
- Create permission guard component
- Handle session expiration
- Auto logout on invalid token
- Add loading states for auth checks

Create:
- src/context/AuthContext.jsx
- src/routes/ProtectedRoute.jsx
- src/routes/RoleGuard.jsx
- src/hooks/useAuth.js
- src/services/authService.js

Requirements:
- Use React Query where appropriate
- Use Axios interceptors
- Store tokens securely
- Redirect unauthorized users to login

---

# STEP 2 — Real API Integration

Replace mocked data with backend integration.

Tasks:
- Integrate incidents API
- Integrate inspections API
- Integrate dashboard metrics API
- Integrate notifications API
- Integrate corrective actions API

Requirements:
- Use existing services folder
- Use React Query hooks
- Add loading states
- Add error handling
- Add optimistic updates where useful
- Avoid duplicate API calls

---

# STEP 3 — Dynamic Dashboard

Replace static dashboard values.

Tasks:
- Fetch KPI metrics from backend
- Fetch recent incidents
- Fetch pending approvals
- Fetch high-risk sites
- Fetch workflow alerts

Requirements:
- Use reusable hooks
- Add skeleton loaders
- Add empty states
- Add retry handling

---

# STEP 4 — Inspection Persistence

Convert inspection module into real workflow.

Tasks:
- Save inspections to backend
- Save checklist responses
- Save findings/recommendations
- Save compliance score
- Support draft save/load
- Support inspection editing
- Load inspection by ID
- Support approval locking

Requirements:
- Keep checklist architecture reusable
- Support dynamic checklist templates
- Maintain offline queue compatibility

---

# STEP 5 — Corrective Actions Integration

Tasks:
- Auto-create CAPA for failed checklist items
- Link CAPA to inspections/incidents
- Add CAPA status updates
- Add overdue detection
- Add closure verification
- Add evidence upload support

Requirements:
- Reuse existing workflow engine
- Reuse notification system
- Reuse SLA logic

---

# STEP 6 — Incident Lifecycle Integration

Tasks:
- Persist incidents
- Persist investigation workflow
- Persist root cause analysis
- Persist management review
- Persist escalation state
- Add incident closure flow

Requirements:
- Maintain approval chain architecture
- Maintain timeline history
- Maintain notification triggers

---

# STEP 7 — Realtime System

Tasks:
- Integrate Socket.IO client
- Add realtime notifications
- Add realtime dashboard updates
- Add realtime approval updates
- Add realtime incident escalation updates

Create:
- src/services/socketService.js

Requirements:
- Auto reconnect
- Graceful disconnect handling
- Event-based architecture

---

# STEP 8 — Offline Improvements

Extend existing offline architecture.

Tasks:
- Add IndexedDB support
- Add upload retry queue
- Add draft recovery UI
- Add sync retry indicators
- Add conflict resolution strategy

Requirements:
- Maintain current localStorage fallback
- Keep sync engine modular

---

# STEP 9 — File Upload System

Tasks:
- Add reusable uploader component
- Add image preview
- Add upload progress
- Add failed upload retry
- Add multi-file support

Create:
- src/components/uploads/

Requirements:
- Support inspections
- Support incidents
- Support CAPA evidence
- Support offline queue

---

# STEP 10 — Risk Assessment Module

Create:
- Risk assessment pages
- HIRA/JSA forms
- Risk matrix
- Control measures
- Residual risk calculation

Requirements:
- Reuse existing form components
- Reuse approval workflow
- Reuse notification system

---

# STEP 11 — Training + Toolbox Module

Tasks:
- Toolbox meetings
- Attendance tracking
- Training records
- Certification expiry tracking

Requirements:
- Reuse existing table system
- Reuse workflow engine

---

# STEP 12 — Reporting Engine

Tasks:
- PDF export
- Excel export
- Incident reports
- Audit reports
- CAPA reports

Requirements:
- Reusable export utilities
- API-driven reports

---

# STEP 13 — Mobile + Tablet Optimization

Tasks:
- Improve tablet layouts
- Add mobile sidebar drawer
- Improve touch interactions
- Optimize field worker forms

Requirements:
- Keep desktop UX unchanged

---

# STEP 14 — Admin Module

Tasks:
- User management
- Role management
- Site management
- Permission management
- Audit logs

Requirements:
- Integrate RBAC system

---

# STEP 15 — Production Readiness

Tasks:
- Add environment configs
- Add centralized logging
- Add error tracking
- Add accessibility improvements
- Add performance optimization
- Add testing setup

Requirements:
- Do NOT rewrite architecture
- Keep existing folder structure
- Keep implementation enterprise-grade