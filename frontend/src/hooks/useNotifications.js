import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

import {
    useAuthContext,
} from '../context/AuthContext'
import {
    getNotifications,
    markNotificationRead,
} from '../services/notificationService'
import {
    getErrorMessage,
} from '../utils/api'

export function useNotificationsQuery() {
    const {
        isAuthenticated,
        loading,
    } = useAuthContext()

    return useQuery({
        queryKey: ['notifications'],
        queryFn: getNotifications,
        enabled:
            !loading &&
            isAuthenticated,
        retry: false,
        staleTime: 30 * 1000,
        refetchInterval:
            !loading &&
            isAuthenticated
                ? 60 * 1000
                : false,
    })
}

export function useMarkNotificationRead() {
    const queryClient =
        useQueryClient()

    return useMutation({
        mutationFn: markNotificationRead,
        onMutate: async (id) => {
            await queryClient.cancelQueries({
                queryKey: ['notifications'],
            })

            const previous =
                queryClient.getQueryData([
                    'notifications',
                ])

            queryClient.setQueryData(
                ['notifications'],
                (current = []) =>
                    current.map(
                        (notification) =>
                            notification.id === id
                                ? {
                                      ...notification,
                                      isRead: true,
                                  }
                                : notification
                    )
            )

            return { previous }
        },
        onError: (error, _, context) => {
            queryClient.setQueryData(
                ['notifications'],
                context?.previous
            )
            toast.error(
                getErrorMessage(error)
            )
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ['notifications'],
            })
        },
    })
}
