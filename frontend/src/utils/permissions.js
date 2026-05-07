export const ROLES = {
    HQ: 'HQ',
    FIELD_OFFICER: 'FIELD_OFFICER',
    SUPERVISOR: 'SUPERVISOR',
    MANAGEMENT: 'MANAGEMENT',
}

const ROLE_ALIASES = {
    HQ: ROLES.HQ,
    HQ_SAFETY_OFFICER: ROLES.HQ,
    FIELD_OFFICER: ROLES.FIELD_OFFICER,
    FIELD_SAFETY_OFFICER: ROLES.FIELD_OFFICER,
    SUPERVISOR: ROLES.SUPERVISOR,
    SAFETY_SUPERVISOR: ROLES.SUPERVISOR,
    MANAGEMENT: ROLES.MANAGEMENT,
    TOP_MANAGEMENT: ROLES.MANAGEMENT,
}

export const FEATURE_PERMISSIONS = {
    APPROVE_INCIDENTS: 'APPROVE_INCIDENTS',
    ACCESS_ANALYTICS: 'ACCESS_ANALYTICS',
    ACCESS_SETTINGS: 'ACCESS_SETTINGS',
    ACCESS_ADMIN_PAGES: 'ACCESS_ADMIN_PAGES',
}

const FEATURE_ROLE_MAP = {
    [FEATURE_PERMISSIONS.APPROVE_INCIDENTS]: [ROLES.HQ],
    [FEATURE_PERMISSIONS.ACCESS_ANALYTICS]: [ROLES.MANAGEMENT],
    [FEATURE_PERMISSIONS.ACCESS_SETTINGS]: [
        ROLES.HQ,
        ROLES.FIELD_OFFICER,
        ROLES.MANAGEMENT,
    ],
    [FEATURE_PERMISSIONS.ACCESS_ADMIN_PAGES]: [
        ROLES.HQ,
        ROLES.MANAGEMENT,
    ],
}

const ROLE_LABELS = {
    [ROLES.HQ]: 'HQ Officer',
    [ROLES.FIELD_OFFICER]: 'Field Officer',
    [ROLES.SUPERVISOR]: 'Supervisor',
    [ROLES.MANAGEMENT]: 'Management',
}

export function normalizeRole(role) {
    if (!role) {
        return null
    }

    return ROLE_ALIASES[role] ?? role
}

export function getRoleLabel(role) {
    const normalizedRole = normalizeRole(role)

    return ROLE_LABELS[normalizedRole] ?? normalizedRole ?? 'Unknown Role'
}

export function hasRole(user, role) {
    return normalizeRole(user?.role) === normalizeRole(role)
}

export function hasAnyRole(user, allowedRoles = []) {
    if (!allowedRoles.length) {
        return true
    }

    const normalizedAllowedRoles = allowedRoles.map(normalizeRole)

    return normalizedAllowedRoles.includes(normalizeRole(user?.role))
}

export function hasPermission(user, permission) {
    const allowedRoles = FEATURE_ROLE_MAP[permission] ?? []

    return hasAnyRole(user, allowedRoles)
}
