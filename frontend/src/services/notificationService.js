import api from '../api/axios'
import {
    unwrapResponse,
} from '../utils/api'

export async function getNotifications() {
    const response = await api.get(
        '/notifications'
    )

    return unwrapResponse(response)
}

export async function markNotificationRead(
    id
) {
    const response = await api.patch(
        `/notifications/${id}/read`
    )

    return unwrapResponse(response)
}
