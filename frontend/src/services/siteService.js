import api from '../api/axios'
import {
    unwrapPaginatedResponse,
} from '../utils/api'

export async function getSites(
    params = {}
) {
    const response = await api.get(
        '/sites',
        {
            params: {
                limit: 100,
                ...params,
            },
        }
    )

    return unwrapPaginatedResponse(
        response
    )
}
