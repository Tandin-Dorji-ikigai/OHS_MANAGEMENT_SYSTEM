import {
    Navigate,
    Outlet,
    useLocation,
} from 'react-router-dom'

import {
    useAuth,
} from '../hooks/useAuth'
import {
    hasAnyRole,
} from '../utils/permissions'

export default function RoleGuard({
    allowedRoles = [],
    redirectTo = '/dashboard',
    children,
}) {
    const location = useLocation()
    const {
        isAuthenticated,
        loading,
        user,
    } = useAuth()

    if (loading) {
        return null
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                }}
            />
        )
    }

    if (
        !hasAnyRole(
            user,
            allowedRoles
        )
    ) {
        return (
            <Navigate
                to={redirectTo}
                replace
            />
        )
    }

    return children ?? <Outlet />
}
