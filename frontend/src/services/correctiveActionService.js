import api from '../api/axios'
import {
    unwrapPaginatedResponse,
    unwrapResponse,
} from '../utils/api'

const MODULE_NAME =
    'corrective_action'

export async function getCorrectiveActions(
    params = {}
) {
    const response = await api.get(
        '/actions',
        {
            params,
        }
    )

    return unwrapPaginatedResponse(
        response
    )
}

export async function getCorrectiveActionById(
    id
) {
    const response = await api.get(
        `/actions/${id}`
    )

    return unwrapResponse(response)
}

export async function createCorrectiveAction(
    payload
) {
    const response = await api.post(
        '/actions',
        payload
    )

    return unwrapResponse(response)
}

export async function updateCorrectiveAction(
    id,
    payload
) {
    const response = await api.patch(
        `/actions/${id}`,
        payload
    )

    return unwrapResponse(response)
}

export async function transitionCorrectiveAction(
    id,
    payload
) {
    const response = await api.post(
        `/actions/${id}/transition`,
        payload
    )

    return unwrapResponse(response)
}

export async function closeCorrectiveAction(
    id,
    payload = {}
) {
    if (
        payload.closureEvidence ||
        payload.verificationComments
    ) {
        await updateCorrectiveAction(
            id,
            payload
        )
    }

    return transitionCorrectiveAction(
        id,
        {
            status:
                'pending_verification',
            comments:
                payload.comments ||
                'Closure evidence submitted for verification',
        }
    )
}

export async function verifyCorrectiveAction(
    id,
    payload = {}
) {
    if (
        payload.verificationComments
    ) {
        await updateCorrectiveAction(
            id,
            {
                verificationComments:
                    payload.verificationComments,
            }
        )
    }

    return transitionCorrectiveAction(
        id,
        {
            status: 'closed',
            comments:
                payload.comments ||
                payload.verificationComments ||
                'Corrective action verified and closed',
        }
    )
}

export async function getCorrectiveActionEvidence(
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

export async function uploadCorrectiveActionEvidence(
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
