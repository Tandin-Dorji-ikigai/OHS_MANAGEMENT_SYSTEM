import {
    useQuery,
} from '@tanstack/react-query'

import {
    getSites,
} from '../services/siteService'

export function useSites(
    params = {}
) {
    return useQuery({
        queryKey: ['sites', params],
        queryFn: () => getSites(params),
        staleTime: 5 * 60 * 1000,
    })
}
