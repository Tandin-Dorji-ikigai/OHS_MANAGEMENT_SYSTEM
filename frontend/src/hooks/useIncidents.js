import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

import {
    addIncidentInvestigation,
    createIncident,
    getIncidentById,
    getIncidents,
    transitionIncident,
    updateIncident,
} from '../services/incidentService'
import {
    getErrorMessage,
} from '../utils/api'

export function useIncidents(
    params = {}
) {
    return useQuery({
        queryKey: ['incidents', params],
        queryFn: () =>
            getIncidents(params),
        staleTime: 60 * 1000,
    })
}

export function useIncident(id) {
    return useQuery({
        queryKey: ['incident', id],
        queryFn: () =>
            getIncidentById(id),
        enabled: Boolean(id),
    })
}

export function useCreateIncident() {
    const queryClient =
        useQueryClient()

    return useMutation({
        mutationFn: createIncident,
        onMutate: async (payload) => {
            await queryClient.cancelQueries({
                queryKey: ['incidents'],
            })

            const previous =
                queryClient.getQueriesData({
                    queryKey: ['incidents'],
                })

            queryClient.setQueriesData(
                {
                    queryKey: ['incidents'],
                },
                (current) => {
                    if (!current?.data) {
                        return current
                    }

                    return {
                        ...current,
                        data: [
                            {
                                id: `temp-${Date.now()}`,
                                ...payload,
                                status: 'draft',
                            },
                            ...current.data,
                        ],
                    }
                }
            )

            return { previous }
        },
        onError: (error, _, context) => {
            context?.previous?.forEach(
                ([queryKey, data]) => {
                    queryClient.setQueryData(
                        queryKey,
                        data
                    )
                }
            )
            toast.error(
                getErrorMessage(error)
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['incidents'],
            })
            queryClient.invalidateQueries({
                queryKey: ['dashboard'],
            })
            toast.success(
                'Incident created.'
            )
        },
    })
}

export function useUpdateIncident() {
    const queryClient =
        useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }) =>
            updateIncident(
                id,
                payload
            ),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['incidents'],
            })
            queryClient.invalidateQueries({
                queryKey: [
                    'incident',
                    variables.id,
                ],
            })
            toast.success(
                'Incident updated.'
            )
        },
        onError: (error) => {
            toast.error(
                getErrorMessage(error)
            )
        },
    })
}

export function useAddIncidentInvestigation() {
    const queryClient =
        useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }) =>
            addIncidentInvestigation(
                id,
                payload
            ),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [
                    'incident',
                    variables.id,
                ],
            })
            toast.success(
                'Investigation recorded.'
            )
        },
        onError: (error) => {
            toast.error(
                getErrorMessage(error)
            )
        },
    })
}

export function useTransitionIncident() {
    const queryClient =
        useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }) =>
            transitionIncident(
                id,
                payload
            ),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['incidents'],
            })
            queryClient.invalidateQueries({
                queryKey: [
                    'incident',
                    variables.id,
                ],
            })
            queryClient.invalidateQueries({
                queryKey: ['dashboard'],
            })
            toast.success(
                'Incident workflow updated.'
            )
        },
        onError: (error) => {
            toast.error(
                getErrorMessage(error)
            )
        },
    })
}
