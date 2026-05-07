import NotificationItem from './NotificationItem'

import {
    useNotifications,
} from '../../context/NotificationContext'

export default function NotificationDropdown() {
    const {
        notifications,
        markAsRead,
        markAllAsRead,
        loading,
    } = useNotifications()

    return (
        <div
            className="
        absolute right-0 top-16 z-50 w-[380px]
        rounded-2xl border border-white/10
        bg-zinc-950 p-4 shadow-2xl
      "
        >
            <div className="mb-4 flex items-center justify-between">

                <h3 className="text-lg font-semibold">
                    Notifications
                </h3>

                <button
                    onClick={markAllAsRead}
                    className="text-sm text-zinc-400"
                >
                    Mark all read
                </button>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({
                        length: 3,
                    }).map((_, index) => (
                        <div
                            key={index}
                            className="animate-pulse rounded-xl border border-white/10 p-4"
                        >
                            <div className="h-4 w-28 rounded bg-white/5" />
                            <div className="mt-3 h-3 w-full rounded bg-white/5" />
                        </div>
                    ))}
                </div>
            ) : notifications.length ? (
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onRead={markAsRead}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-sm text-zinc-400">
                    No notifications yet.
                </p>
            )}
        </div>
    )
}
