import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

import {
    createInspection,
    getInspectionById,
    getInspections,
    transitionInspection,
    updateInspection,
} from '../services/inspectionService'
import {
    getErrorMessage,
} from '../utils/api'

export function useInspections(
    params = {}
) {
    return useQuery({
        queryKey: ['inspections', params],
        queryFn: () =>
            getInspections(params),
        staleTime: 60 * 1000,
    })
}

export function useInspection(id) {
    return useQuery({
        queryKey: ['inspection', id],
        queryFn: () =>
            getInspectionById(id),
        enabled: Boolean(id),
    })
}

export function useCreateInspection() {
    const queryClient =
        useQueryClient()

    return useMutation({
        mutationFn: createInspection,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['inspections'],
            })
            queryClient.invalidateQueries({
                queryKey: ['dashboard'],
            })
            toast.success(
                'Inspection created.'
            )
        },
        onError: (error) => {
            toast.error(
                getErrorMessage(error)
            )
        },
    })
}

export function useUpdateInspection() {
    const queryClient =
        useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }) =>
            updateInspection(
                id,
                payload
            ),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['inspections'],
            })
            queryClient.invalidateQueries({
                queryKey: [
                    'inspection',
                    variables.id,
                ],
            })
            toast.success(
                'Inspection updated.'
            )
        },
        onError: (error) => {
            toast.error(
                getErrorMessage(error)
            )
        },
    })
}

export function useTransitionInspection() {
    const queryClient =
        useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }) =>
            transitionInspection(
                id,
                payload
            ),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['inspections'],
            })
            queryClient.invalidateQueries({
                queryKey: [
                    'inspection',
                    variables.id,
                ],
            })
            queryClient.invalidateQueries({
                queryKey: ['dashboard'],
            })
            toast.success(
                'Inspection workflow updated.'
            )
        },
        onError: (error) => {
            toast.error(
                getErrorMessage(error)
            )
        },
    })
}
