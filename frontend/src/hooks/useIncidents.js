import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

import {
    approveIncident,
    assignInvestigator,
    closeIncident,
    createIncidentEscalation,
    createIncident,
    getIncidentById,
    getIncidentEvidence,
    getIncidents,
    rejectIncident,
    saveIncidentManagementReview,
    transitionIncident,
    updateIncident,
    uploadIncidentEvidence,
    addIncidentInvestigation,
} from '../services/incidentService'
import {
    getErrorMessage,
} from '../utils/api'

const dashboardKeys = [
    ['dashboard'],
    ['dashboard-metrics'],
    ['recent-incidents'],
    ['pending-approvals'],
    ['workflow-alerts'],
    ['high-risk-sites'],
    ['recent-activity'],
]

function invalidateDashboard(
    queryClient
) {
    dashboardKeys.forEach(
        (queryKey) => {
            queryClient.invalidateQueries({
                queryKey,
            })
        }
    )
}

export function useIncidents(
    params = {}
) {
    return useQuery({
        queryKey: [
            'incidents',
            params,
        ],
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

export function useIncidentEvidence(
    id
) {
    return useQuery({
        queryKey: [
            'incident-evidence',
            id,
        ],
        queryFn: () =>
            getIncidentEvidence(id),
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
            invalidateDashboard(
                queryClient
            )
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
            invalidateDashboard(
                queryClient
            )
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
            queryClient.invalidateQueries({
                queryKey: [
                    'incidents',
                ],
            })
            invalidateDashboard(
                queryClient
            )
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

export function useAssignInvestigator() {
    const queryClient =
        useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }) =>
            assignInvestigator(
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
            queryClient.invalidateQueries({
                queryKey: [
                    'incidents',
                ],
            })
            invalidateDashboard(
                queryClient
            )
            toast.success(
                'Investigator assigned.'
            )
        },
        onError: (error) => {
            toast.error(
                getErrorMessage(error)
            )
        },
    })
}

export function useSaveIncidentManagementReview() {
    const queryClient =
        useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }) =>
            saveIncidentManagementReview(
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
            queryClient.invalidateQueries({
                queryKey: [
                    'incidents',
                ],
            })
            invalidateDashboard(
                queryClient
            )
            toast.success(
                'Management review saved.'
            )
        },
        onError: (error) => {
            toast.error(
                getErrorMessage(error)
            )
        },
    })
}

export function useCreateIncidentEscalation() {
    const queryClient =
        useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }) =>
            createIncidentEscalation(
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
            queryClient.invalidateQueries({
                queryKey: [
                    'incidents',
                ],
            })
            invalidateDashboard(
                queryClient
            )
            toast.success(
                'Escalation recorded.'
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
        onMutate: async ({
            id,
            payload,
        }) => {
            await queryClient.cancelQueries({
                queryKey: [
                    'incident',
                    id,
                ],
            })

            const previous =
                queryClient.getQueryData([
                    'incident',
                    id,
                ])

            queryClient.setQueryData(
                [
                    'incident',
                    id,
                ],
                (current) =>
                    current
                        ? {
                              ...current,
                              incident: {
                                  ...current.incident,
                                  status:
                                      payload.status,
                              },
                          }
                        : current
            )

            return { previous, id }
        },
        onError: (
            error,
            _,
            context
        ) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    [
                        'incident',
                        context.id,
                    ],
                    context.previous
                )
            }
            toast.error(
                getErrorMessage(error)
            )
        },
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
            invalidateDashboard(
                queryClient
            )
            toast.success(
                'Incident workflow updated.'
            )
        },
    })
}

export function useApproveIncident() {
    const queryClient =
        useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }) =>
            approveIncident(
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
            invalidateDashboard(
                queryClient
            )
            toast.success(
                'Incident approved.'
            )
        },
        onError: (error) => {
            toast.error(
                getErrorMessage(error)
            )
        },
    })
}

export function useRejectIncident() {
    const queryClient =
        useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }) =>
            rejectIncident(
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
            invalidateDashboard(
                queryClient
            )
            toast.success(
                'Incident rejected.'
            )
        },
        onError: (error) => {
            toast.error(
                getErrorMessage(error)
            )
        },
    })
}

export function useCloseIncident() {
    const queryClient =
        useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }) =>
            closeIncident(
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
            invalidateDashboard(
                queryClient
            )
            toast.success(
                'Incident closed.'
            )
        },
        onError: (error) => {
            toast.error(
                getErrorMessage(error)
            )
        },
    })
}

export function useUploadIncidentEvidence() {
    const queryClient =
        useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }) =>
            uploadIncidentEvidence(
                id,
                payload
            ),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [
                    'incident-evidence',
                    variables.id,
                ],
            })
            queryClient.invalidateQueries({
                queryKey: [
                    'incident',
                    variables.id,
                ],
            })
            toast.success(
                'Evidence uploaded.'
            )
        },
        onError: (error) => {
            toast.error(
                getErrorMessage(error)
            )
        },
    })
}
