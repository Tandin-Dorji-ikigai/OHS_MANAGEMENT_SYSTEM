import {
    LayoutDashboard,
    ClipboardCheck,
    AlertTriangle,
    ShieldAlert,
    Users,
} from 'lucide-react'
import {
    ROLES,
} from '../utils/permissions'

const coreNavigation = [
    {
        name: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Inspections',
        path: '/inspections',
        icon: ClipboardCheck,
    },
    {
        name: 'Incidents',
        path: '/incidents',
        icon: AlertTriangle,
    },
    {
        name: 'Corrective Actions',
        path: '/corrective-actions',
        icon: ShieldAlert,
    },
]

export const navigationByRole = {
    [ROLES.HQ]: [
        ...coreNavigation,
        {
            name: 'User Management',
            path: '/settings/users/create',
            icon: Users,
        },
    ],
    [ROLES.FIELD_OFFICER]:
        coreNavigation,
    [ROLES.SUPERVISOR]:
        coreNavigation,
    [ROLES.MANAGEMENT]: [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            name: 'Incidents',
            path: '/incidents',
            icon: AlertTriangle,
        },
        {
            name: 'Corrective Actions',
            path: '/corrective-actions',
            icon: ShieldAlert,
        },
    ],
}
