import clsx from 'clsx'

const typeStyles = {
    critical: 'border-red-500/20 bg-red-500/5',
    warning: 'border-yellow-500/20 bg-yellow-500/5',
    info: 'border-blue-500/20 bg-blue-500/5',
}

export default function NotificationItem({
    notification,
    onRead,
}) {
    return (
        <button
            onClick={() => onRead(notification.id)}
            className={clsx(
                'w-full rounded-xl border p-4 text-left transition',
                typeStyles[notification.type]
            )}
        >
            <div className="flex items-start justify-between">

                <div>
                    <h4 className="font-medium text-white">
                        {notification.title}
                    </h4>

                    <p className="mt-2 text-sm text-zinc-400">
                        {notification.message}
                    </p>
                </div>

                {!notification.isRead && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                )}
            </div>
        </button>
    )
}
