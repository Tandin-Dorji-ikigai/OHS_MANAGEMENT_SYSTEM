import api from '../api/axios'

function unwrapResponse(response) {
    return response.data?.data ?? response.data ?? null
}

export async function getUserManagementOptions() {
    const response = await api.get(
        '/users/options'
    )

    return unwrapResponse(response)
}

export async function createUser(payload) {
    const response = await api.post(
        '/users',
        payload
    )

    return unwrapResponse(response)
}

export async function getUsers(
    params = {}
) {
    const response = await api.get(
        '/users',
        {
            params,
        }
    )

    return {
        data:
            response.data?.data ?? [],
        pagination:
            response.data?.pagination ??
            null,
    }
}
