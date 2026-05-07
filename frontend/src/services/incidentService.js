import api from '../api/axios'
import {
    unwrapPaginatedResponse,
    unwrapResponse,
} from '../utils/api'

const MODULE_NAME = 'incident'

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

export async function assignInvestigator(
    id,
    payload
) {
    const response = await api.post(
        `/incidents/${id}/assign-investigator`,
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

export async function approveIncident(
    id,
    payload = {}
) {
    return transitionIncident(id, {
        status: 'approved',
        ...payload,
    })
}

export async function rejectIncident(
    id,
    payload = {}
) {
    return transitionIncident(id, {
        status: 'rejected',
        ...payload,
    })
}

export async function closeIncident(
    id,
    payload = {}
) {
    return transitionIncident(id, {
        status: 'closed',
        ...payload,
    })
}

export async function saveIncidentManagementReview(
    id,
    payload
) {
    const response = await api.post(
        `/incidents/${id}/management-review`,
        payload
    )

    return unwrapResponse(response)
}

export async function createIncidentEscalation(
    id,
    payload
) {
    const response = await api.post(
        `/incidents/${id}/escalations`,
        payload
    )

    return unwrapResponse(response)
}

export async function getIncidentEvidence(
    id
) {
    const response = await api.get(
        '/attachments',
        {
            params: {
                moduleName:
                    MODULE_NAME,
                recordId: id,
            },
        }
    )

    return unwrapResponse(response)
}

export async function uploadIncidentEvidence(
    id,
    {
        file,
        siteId,
        onUploadProgress,
    }
) {
    const formData =
        new FormData()

    formData.append('file', file)
    formData.append(
        'moduleName',
        MODULE_NAME
    )
    formData.append('recordId', id)

    if (siteId) {
        formData.append(
            'siteId',
            siteId
        )
    }

    const response = await api.post(
        '/attachments',
        formData,
        {
            headers: {
                'Content-Type':
                    'multipart/form-data',
            },
            onUploadProgress,
        }
    )

    return unwrapResponse(response)
}
