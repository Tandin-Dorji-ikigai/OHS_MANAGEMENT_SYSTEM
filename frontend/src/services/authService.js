import api from '../api/axios'
import {
    getRoleLabel,
    normalizeRole,
} from '../utils/permissions'

const AUTH_BASE_PATH = '/auth'

function unwrapResponse(response) {
    return response.data?.data ?? response.data ?? null
}

function normalizeUser(user) {
    if (!user) {
        return null
    }

    const role = normalizeRole(
        user.role ?? user.roleName
    )

    return {
        ...user,
        role,
        roleName: role,
        roleLabel: getRoleLabel(role),
        rawRole:
            user.rawRole ??
            user.role ??
            user.roleName ??
            null,
        fullName:
            [
                user.firstName,
                user.lastName,
            ]
                .filter(Boolean)
                .join(' ')
                .trim() || user.email,
    }
}

function normalizeAuthPayload(payload) {
    return {
        ...payload,
        user: normalizeUser(payload?.user),
    }
}

async function requestCurrentUser(path) {
    const response = await api.get(path)

    return normalizeUser(
        unwrapResponse(response)
    )
}

export async function login(credentials) {
    const response = await api.post(
        `${AUTH_BASE_PATH}/login`,
        credentials,
        {
            skipAuthRedirect: true,
        }
    )

    return normalizeAuthPayload(
        unwrapResponse(response)
    )
}

export async function signup(payload) {
    const response = await api.post(
        `${AUTH_BASE_PATH}/register`,
        payload,
        {
            skipAuthRedirect: true,
        }
    )

    return normalizeAuthPayload(
        unwrapResponse(response)
    )
}

export async function logout() {
    try {
        await api.post(
            `${AUTH_BASE_PATH}/logout`,
            {},
            {
                skipAuthRedirect: true,
            }
        )
    } catch (error) {
        if (
            ![400, 401, 404].includes(
                error.response?.status
            )
        ) {
            throw error
        }
    }
}

export async function getCurrentUser() {
    return requestCurrentUser(
        `${AUTH_BASE_PATH}/me`
    )
}

export async function refreshSession() {
    try {
        await api.post(
            `${AUTH_BASE_PATH}/refresh`,
            {},
            {
                skipAuthRedirect: true,
            }
        )
    } catch (error) {
        if (error.response?.status !== 401) {
            throw error
        }
    }

    return getCurrentUser()
}

export async function getRegistrationOptions() {
    const response = await api.get(
        `${AUTH_BASE_PATH}/register/options`,
        {
            skipAuthRedirect: true,
        }
    )

    return unwrapResponse(response)
}
