import { Routes, Route, Navigate } from 'react-router-dom'

import LoginPage from '../pages/auth/LoginPage'
import SignupPage from '../pages/auth/SignupPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import InspectionListPage from '../pages/inspections/InspectionListPage'
import CreateInspectionPage from '../pages/inspections/CreateInspectionPage'

import CorrectiveActionsPage from '../pages/corrective-actions/CorrectiveActionsPage'
import CorrectiveActionDetailsPage from '../pages/corrective-actions/CorrectiveActionDetailsPage'

import IncidentListPage from '../pages/incidents/IncidentListPage'
import CreateIncidentPage from '../pages/incidents/CreateIncidentPage'
import IncidentDetailsPage from '../pages/incidents/IncidentDetailsPage'
import CreateUserPage from '../pages/settings/CreateUserPage'
import ProtectedRoute from './ProtectedRoute'
import RoleGuard from './RoleGuard'
import {
    ROLES,
} from '../utils/permissions'

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route element={<ProtectedRoute />}>
                <Route
                    path="/dashboard"
                    element={<DashboardPage />}
                />

                <Route
                    path="/inspections"
                    element={<InspectionListPage />}
                />

                <Route
                    path="/corrective-actions"
                    element={<CorrectiveActionsPage />}
                />

                <Route
                    path="/corrective-actions/:id"
                    element={<CorrectiveActionDetailsPage />}
                />

                <Route
                    path="/incidents"
                    element={<IncidentListPage />}
                />

                <Route
                    path="/incidents/:id"
                    element={<IncidentDetailsPage />}
                />

                <Route
                    element={
                        <RoleGuard
                            allowedRoles={[
                                ROLES.HQ,
                            ]}
                        />
                    }
                >
                    <Route
                        path="/settings/users/create"
                        element={<CreateUserPage />}
                    />
                </Route>

                <Route
                    element={
                        <RoleGuard
                            allowedRoles={[
                                ROLES.HQ,
                                ROLES.FIELD_OFFICER,
                                ROLES.SUPERVISOR,
                            ]}
                        />
                    }
                >
                    <Route
                        path="/inspections/create"
                        element={
                            <CreateInspectionPage />
                        }
                    />

                    <Route
                        path="/incidents/create"
                        element={
                            <CreateIncidentPage />
                        }
                    />
                </Route>
            </Route>
        </Routes>
    )
}
