import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react'
import {
    useLocation,
    useNavigate,
} from 'react-router-dom'
import {
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'

import {
    AUTH_UNAUTHORIZED_EVENT,
} from '../api/axios'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

const AUTH_QUERY_KEY = ['auth', 'current-user']
const PUBLIC_ROUTES = ['/login', '/signup']

export function AuthProvider({
    children,
}) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryClient =
        useQueryClient()
    const [user, setUser] = useState(null)

    const sessionQuery = useQuery({
        queryKey: AUTH_QUERY_KEY,
        queryFn: authService.getCurrentUser,
        retry: false,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    })

    useEffect(() => {
        if (sessionQuery.isSuccess) {
            setUser(sessionQuery.data)
            return
        }

        if (sessionQuery.isError) {
            setUser(null)
        }
    }, [
        sessionQuery.data,
        sessionQuery.isError,
        sessionQuery.isSuccess,
    ])

    useEffect(() => {
        function handleUnauthorized() {
            setUser(null)
            queryClient.removeQueries({
                predicate: (query) =>
                    query.queryKey[0] !==
                    'auth',
            })
            queryClient.setQueryData(
                AUTH_QUERY_KEY,
                null
            )

            if (
                PUBLIC_ROUTES.includes(
                    window.location.pathname
                )
            ) {
                return
            }

            navigate('/login', {
                replace: true,
                state: {
                    from: location,
                },
            })
        }

        window.addEventListener(
            AUTH_UNAUTHORIZED_EVENT,
            handleUnauthorized
        )

        return () => {
            window.removeEventListener(
                AUTH_UNAUTHORIZED_EVENT,
                handleUnauthorized
            )
        }
    }, [
        location,
        navigate,
        queryClient,
    ])

    async function hydrateUser(
        nextUser
    ) {
        const resolvedUser =
            nextUser ??
            (await authService.getCurrentUser())

        setUser(resolvedUser)
        queryClient.setQueryData(
            AUTH_QUERY_KEY,
            resolvedUser
        )

        return resolvedUser
    }

    async function login(credentials) {
        const result =
            await authService.login(
                credentials
            )

        return hydrateUser(result.user)
    }

    async function signup(payload) {
        const result =
            await authService.signup(payload)

        return hydrateUser(result.user)
    }

    async function refreshSession() {
        const refreshedUser =
            await authService.refreshSession()

        setUser(refreshedUser)
        queryClient.setQueryData(
            AUTH_QUERY_KEY,
            refreshedUser
        )

        return refreshedUser
    }

    async function logout() {
        try {
            await authService.logout()
        } finally {
            setUser(null)
            queryClient.removeQueries({
                predicate: (query) =>
                    query.queryKey[0] !==
                    'auth',
            })
            queryClient.setQueryData(
                AUTH_QUERY_KEY,
                null
            )
            navigate('/login', {
                replace: true,
            })
        }
    }

    const value = useMemo(
        () => ({
            user,
            login,
            logout,
            signup,
            refreshSession,
            loading:
                sessionQuery.isLoading,
            isAuthenticated:
                Boolean(user),
            role: user?.role ?? null,
        }),
        [sessionQuery.isLoading, user]
    )

    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    const context =
        useContext(AuthContext)

    if (!context) {
        throw new Error(
            'useAuth must be used within an AuthProvider'
        )
    }

    return context
}
