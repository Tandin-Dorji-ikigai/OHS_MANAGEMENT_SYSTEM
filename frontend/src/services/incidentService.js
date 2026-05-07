import api from '../api/axios'
import {
    unwrapPaginatedResponse,
    unwrapResponse,
} from '../utils/api'

export async function getIncidents(
    params = {}
) {
    const response = await api.get(
        '/incidents',
        {
            params,
        }
    )

    return unwrapPaginatedResponse(
        response
    )
}

export async function getIncidentById(
    id
) {
    const response = await api.get(
        `/incidents/${id}`
    )

    return unwrapResponse(response)
}

export async function createIncident(
    payload
) {
    const response = await api.post(
        '/incidents',
        payload
    )

    return unwrapResponse(response)
}

export async function updateIncident(
    id,
    payload
) {
    const response = await api.patch(
        `/incidents/${id}`,
        payload
    )

    return unwrapResponse(response)
}

export async function addIncidentInvestigation(
    id,
    payload
) {
    const response = await api.post(
        `/incidents/${id}/investigations`,
        payload
    )

    return unwrapResponse(response)
}

export async function transitionIncident(
    id,
    payload
) {
    const response = await api.post(
        `/incidents/${id}/transition`,
        payload
    )

    return unwrapResponse(response)
}
