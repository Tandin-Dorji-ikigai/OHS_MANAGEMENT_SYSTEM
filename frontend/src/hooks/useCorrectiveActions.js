import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

import {
    closeCorrectiveAction,
    createCorrectiveAction,
    getCorrectiveActionById,
    getCorrectiveActionEvidence,
    getCorrectiveActions,
    transitionCorrectiveAction,
    updateCorrectiveAction,
    uploadCorrectiveActionEvidence,
    verifyCorrectiveAction,
} from '../services/correctiveActionService'
import {
    getErrorMessage,
} from '../utils/api'

const dashboardKeys = [
    ['dashboard'],
    ['dashboard-metrics'],
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

export function useCorrectiveActions(
    params = {}
) {
    return useQuery({
        queryKey: [
            'corrective-actions',
            params,
        ],
        queryFn: () =>
            getCorrectiveActions(params),
        staleTime: 60 * 1000,
    })
}

export function useOverdueCorrectiveActions() {
    return useCorrectiveActions({
        overdue: true,
    })
}

export function useCorrectiveAction(id) {
    return useQuery({
        queryKey: [
            'corrective-action',
            id,
        ],
        queryFn: () =>
            getCorrectiveActionById(id),
        enabled: Boolean(id),
    })
}

export function useCorrectiveActionEvidence(
    id
) {
    return useQuery({
        queryKey: [
            'corrective-action-evidence',
            id,
        ],
        queryFn: () =>
            getCorrectiveActionEvidence(
                id
            ),
        enabled: Boolean(id),
    })
}

export function useCreateCorrectiveAction() {
    const queryClient =
        useQueryClient()

    return useMutation({
        mutationFn:
            createCorrectiveAction,
        onMutate: async (payload) => {
            await queryClient.cancelQueries({
                queryKey: [
                    'corrective-actions',
                ],
            })

            const previous =
                queryClient.getQueriesData(
                    {
                        queryKey: [
                            'corrective-actions',
                        ],
                    }
                )

            queryClient.setQueriesData(
                {
                    queryKey: [
                        'corrective-actions',
                    ],
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
                                status: 'open',
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
                queryKey: [
                    'corrective-actions',
                ],
            })
            invalidateDashboard(
                queryClient
            )
            toast.success(
                'Corrective action created.'
            )
        },
    })
}

export function useUpdateCorrectiveAction() {
    const queryClient =
        useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }) =>
            updateCorrectiveAction(
                id,
                payload
            ),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [
                    'corrective-actions',
                ],
            })
            queryClient.invalidateQueries({
                queryKey: [
                    'corrective-action',
                    variables.id,
                ],
            })
            invalidateDashboard(
                queryClient
            )
            toast.success(
                'Corrective action updated.'
            )
        },
        onError: (error) => {
            toast.error(
                getErrorMessage(error)
            )
        },
    })
}

export function useTransitionCorrectiveAction() {
    const queryClient =
        useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }) =>
            transitionCorrectiveAction(
                id,
                payload
            ),
        onMutate: async ({
            id,
            payload,
        }) => {
            await queryClient.cancelQueries({
                queryKey: [
                    'corrective-action',
                    id,
                ],
            })

            const previous =
                queryClient.getQueryData([
                    'corrective-action',
                    id,
                ])

            queryClient.setQueryData(
                [
                    'corrective-action',
                    id,
                ],
                (current) =>
                    current
                        ? {
                              ...current,
                              record: {
                                  ...current.record,
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
                        'corrective-action',
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
                queryKey: [
                    'corrective-actions',
                ],
            })
            queryClient.invalidateQueries({
                queryKey: [
                    'corrective-action',
                    variables.id,
                ],
            })
            invalidateDashboard(
                queryClient
            )
            toast.success(
                'Corrective action workflow updated.'
            )
        },
    })
}

export function useCloseCorrectiveAction() {
    const queryClient =
        useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }) =>
            closeCorrectiveAction(
                id,
                payload
            ),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [
                    'corrective-actions',
                ],
            })
            queryClient.invalidateQueries({
                queryKey: [
                    'corrective-action',
                    variables.id,
                ],
            })
            invalidateDashboard(
                queryClient
            )
            toast.success(
                'Corrective action submitted for verification.'
            )
        },
        onError: (error) => {
            toast.error(
                getErrorMessage(error)
            )
        },
    })
}

export function useVerifyCorrectiveAction() {
    const queryClient =
        useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }) =>
            verifyCorrectiveAction(
                id,
                payload
            ),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [
                    'corrective-actions',
                ],
            })
            queryClient.invalidateQueries({
                queryKey: [
                    'corrective-action',
                    variables.id,
                ],
            })
            invalidateDashboard(
                queryClient
            )
            toast.success(
                'Corrective action verified and closed.'
            )
        },
        onError: (error) => {
            toast.error(
                getErrorMessage(error)
            )
        },
    })
}

export function useUploadCorrectiveActionEvidence() {
    const queryClient =
        useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }) =>
            uploadCorrectiveActionEvidence(
                id,
                payload
            ),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [
                    'corrective-action-evidence',
                    variables.id,
                ],
            })
            queryClient.invalidateQueries({
                queryKey: [
                    'corrective-action',
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
