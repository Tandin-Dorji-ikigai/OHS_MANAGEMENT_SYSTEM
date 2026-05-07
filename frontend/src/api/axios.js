import axios from 'axios'

export const AUTH_UNAUTHORIZED_EVENT =
    'auth:unauthorized'

const DEFAULT_API_URL =
    '/api'

const apiBaseUrl =
    import.meta.env.VITE_API_URL?.trim() ||
    DEFAULT_API_URL

const AUTH_PATH_PREFIX = '/auth'
const AUTH_PATH_EXCEPTIONS = new Set([
    `${AUTH_PATH_PREFIX}/login`,
    `${AUTH_PATH_PREFIX}/register`,
    `${AUTH_PATH_PREFIX}/refresh`,
    `${AUTH_PATH_PREFIX}/logout`,
])

let isUnauthorizedEventPending =
    false

const api = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,

    headers: {
        'Content-Type':
            'application/json',
    },
})

api.interceptors.request.use(
    (config) => {
        return config
    },

    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,

    (error) => {
        const status =
            error.response?.status
        const requestPath =
            error.config?.url ?? ''
        const isAuthException =
            AUTH_PATH_EXCEPTIONS.has(
                requestPath
            )

        if (
            status === 401 &&
            !error.config?.skipAuthRedirect &&
            !isAuthException &&
            !isUnauthorizedEventPending
        ) {
            isUnauthorizedEventPending =
                true

            window.dispatchEvent(
                new CustomEvent(
                    AUTH_UNAUTHORIZED_EVENT
                )
            )

            window.setTimeout(() => {
                isUnauthorizedEventPending =
                    false
            }, 0)
        }

        return Promise.reject(error)
    }
)

export default api
