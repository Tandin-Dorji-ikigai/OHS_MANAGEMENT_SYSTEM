import {
    Navigate,
    Outlet,
    useLocation,
} from 'react-router-dom'

import {
    useAuth,
} from '../hooks/useAuth'

function LoadingFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-black px-6 text-sm text-zinc-400">
            Validating session...
        </div>
    )
}

export default function ProtectedRoute({
    children,
}) {
    const location = useLocation()
    const {
        isAuthenticated,
        loading,
    } = useAuth()

    if (loading) {
        return <LoadingFallback />
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

    return children ?? <Outlet />
}
