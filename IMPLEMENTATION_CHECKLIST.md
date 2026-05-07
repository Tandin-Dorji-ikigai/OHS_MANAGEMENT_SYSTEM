# OHS Management System Implementation Checklist

This checklist converts the current architecture review into execution work.

## Delivery Rule

A module is not complete until all of the following are true:

- backend permissions are enforced
- workflow transitions are correct
- attachments and history are visible in the UI
- notifications fire correctly
- dashboard and report numbers are accurate
- field usage is acceptable on tablet/mobile
- critical paths have tests

## Phase 1: Critical Control Gaps

### 1. RBAC and Scope Enforcement

- [ ] Add backend authorization middleware for role-based access control
- [ ] Restrict generic CRUD routes created by [backend/src/routes/createModuleRoutes.js](backend/src/routes/createModuleRoutes.js)
- [ ] Enforce read-only behavior for `TOP_MANAGEMENT`
- [ ] Enforce field-site scope for `FIELD_SAFETY_OFFICER` and `SAFETY_SUPERVISOR`
- [ ] Enforce HQ-only approval actions where required
- [ ] Audit delete permissions across all modules
- [ ] Add transition permission checks per module in service layer
- [ ] Add tests for unauthorized create/update/delete/transition attempts

Files to touch first:

- [backend/src/routes/createModuleRoutes.js](backend/src/routes/createModuleRoutes.js)
- [backend/src/middleware](backend/src/middleware)
- [backend/src/constants/roles.js](backend/src/constants/roles.js)
- `backend/src/services/*Service.js`

### 2. Approval Matrix Enforcement

- [ ] Define one approval matrix for inspections, incidents, risk assessments, and plans
- [ ] Encode allowed transitions by role
- [ ] Block invalid transitions at backend level
- [ ] Return clear API errors for forbidden transitions
- [ ] Align frontend action buttons with backend permissions
- [ ] Add transition tests for each role and module

### 3. Reports Module

- [ ] Replace placeholder [frontend/src/pages/reports/ReportsPage.jsx](frontend/src/pages/reports/ReportsPage.jsx)
- [ ] Add backend report query endpoints
- [ ] Add management KPI export views
- [ ] Add CSV export for monthly summaries
- [ ] Add PDF export for approved reports
- [ ] Add filters by site, period, and status
- [ ] Ensure management-only approved data appears in management reports

### 4. Notifications

- [ ] Replace hardcoded notifications in [frontend/src/pages/notifications/NotificationsPage.jsx](frontend/src/pages/notifications/NotificationsPage.jsx)
- [ ] Connect notifications page to live API
- [ ] Add unread count in app shell
- [ ] Add mark-as-read behavior
- [ ] Add reminder jobs for pending approvals
- [ ] Add high-severity incident alerts

## Phase 2: Operational Completeness

### 5. Attachments and Evidence

- [ ] Standardize attachment widget across inspections, incidents, risks, trainings, and activities
- [ ] Add attachment preview/download in review screens
- [ ] Show attachment history in detail pages
- [ ] Validate required evidence for configured workflows

### 6. Dashboard Accuracy and Drill-Downs

- [ ] Verify all dashboard counts against approved backend data
- [ ] Add drill-down links from KPI cards to filtered module screens
- [ ] Add incident trend windows for management
- [ ] Add compliance ranking drill-down by site
- [ ] Add overdue corrective actions summary

### 7. Corrective Action Tracking

- [ ] Link actions back to source incident/inspection/risk
- [ ] Add overdue escalation logic
- [ ] Add verification and closure workflow
- [ ] Add action aging views and filters

### 8. Module Completion Pass

- [ ] Inspection module scheduling and review polish
- [ ] Incident investigation and closure polish
- [ ] Risk assessment register and review flow
- [ ] Trainings/toolbox module review and reporting
- [ ] OHS planning milestones, owners, and committee workflow

## Phase 3: Field Readiness and Deployment Hardening

### 9. Offline Capability

- [ ] Choose offline approach: PWA sync queue or dedicated mobile client
- [ ] Add local persistence for draft records
- [ ] Add retry/sync queue for remote field submission
- [ ] Add conflict handling for edited records
- [ ] Add sync status UI

### 10. Mobile/Tablet Field Experience

- [ ] Review inspection, incident, and toolbox flows on tablet widths
- [ ] Optimize large forms for touch input
- [ ] Add resilient upload behavior for weak network conditions

### 11. Background Jobs

- [ ] Add scheduled reminders for pending approvals
- [ ] Add overdue corrective action reminders
- [ ] Add scheduled management digest/report generation

### 12. Testing and Release Hardening

- [ ] Add backend tests for RBAC and transition rules
- [ ] Add frontend tests for key approval workflows
- [ ] Add error boundaries for major app sections
- [ ] Review production file storage strategy
- [ ] Add logging, monitoring, and backup checklist

## Current Starting Sequence

1. RBAC and site-scope enforcement
2. Approval matrix enforcement
3. Live notifications
4. Reports module
5. Dashboard KPI validation

## Active Track

- `IN PROGRESS`: RBAC and site-scope enforcement

## Immediate Next Build Task

Start with route and service authorization so the system behavior matches the intended HQ vs field vs management control model before adding more UI.
