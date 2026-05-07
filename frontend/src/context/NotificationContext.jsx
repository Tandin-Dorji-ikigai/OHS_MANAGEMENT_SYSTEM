import {
    createContext,
    useContext,
    useMemo,
} from 'react'

import {
    useMarkNotificationRead,
    useNotificationsQuery,
} from '../hooks/useNotifications'

const NotificationContext =
    createContext(null)

export function NotificationProvider({
    children,
}) {
    const notificationsQuery =
        useNotificationsQuery()
    const markAsReadMutation =
        useMarkNotificationRead()

    const notifications =
        notificationsQuery.data ?? []
    const unreadCount =
        notifications.filter(
            (notification) =>
                !notification.isRead
        ).length

    const value = useMemo(
        () => ({
            notifications,
            unreadCount,
            loading:
                notificationsQuery.isLoading,
            error:
                notificationsQuery.error,
            refetch:
                notificationsQuery.refetch,
            markAsRead: (id) =>
                markAsReadMutation.mutate(
                    id
                ),
            markAllAsRead: () =>
                notifications
                    .filter(
                        (notification) =>
                            !notification.isRead
                    )
                    .forEach(
                        (notification) =>
                            markAsReadMutation.mutate(
                                notification.id
                            )
                    ),
        }),
        [
            markAsReadMutation,
            notifications,
            notificationsQuery.error,
            notificationsQuery.isLoading,
            notificationsQuery.refetch,
            unreadCount,
        ]
    )

    return (
        <NotificationContext.Provider
            value={value}
        >
            {children}
        </NotificationContext.Provider>
    )
}

export function useNotifications() {
    const context =
        useContext(
            NotificationContext
        )

    if (!context) {
        throw new Error(
            'useNotifications must be used within a NotificationProvider'
        )
    }

    return context
}
