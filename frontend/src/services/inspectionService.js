import api from '../api/axios'
import {
    unwrapPaginatedResponse,
    unwrapResponse,
} from '../utils/api'

export async function getInspections(
    params = {}
) {
    const response = await api.get(
        '/inspections',
        {
            params,
        }
    )

    return unwrapPaginatedResponse(
        response
    )
}

export async function getInspectionById(
    id
) {
    const response = await api.get(
        `/inspections/${id}`
    )

    return unwrapResponse(response)
}

export async function createInspection(
    payload
) {
    const response = await api.post(
        '/inspections',
        payload
    )

    return unwrapResponse(response)
}

export async function updateInspection(
    id,
    payload
) {
    const response = await api.patch(
        `/inspections/${id}`,
        payload
    )

    return unwrapResponse(response)
}

export async function transitionInspection(
    id,
    payload
) {
    const response = await api.post(
        `/inspections/${id}/transition`,
        payload
    )

    return unwrapResponse(response)
}
