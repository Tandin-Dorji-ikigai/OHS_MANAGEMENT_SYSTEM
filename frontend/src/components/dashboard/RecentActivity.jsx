export default function RecentActivity({
    activities = [],
    loading,
    error,
    onRetry,
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-6 text-lg font-semibold">
                Recent Activity
            </h3>

            {loading ? (
                <div className="space-y-4">
                    {Array.from({
                        length: 4,
                    }).map((_, index) => (
                        <div
                            key={index}
                            className="flex gap-3"
                        >
                            <div className="mt-1 h-2 w-2 rounded-full bg-white/5" />
                            <div className="h-4 w-full rounded bg-white/5" />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                    <p className="text-sm text-red-300">
                        Unable to load recent activity.
                    </p>
                    {onRetry ? (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="mt-3 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200"
                        >
                            Retry
                        </button>
                    ) : null}
                </div>
            ) : activities.length ? (
                <div className="space-y-4">
                    {activities.map(
                        (activity) => (
                            <div
                                key={
                                    activity.id
                                }
                                className="flex gap-3"
                            >
                                <div className="mt-2 h-2 w-2 rounded-full bg-white" />

                                <div>
                                    <p className="text-sm text-zinc-300">
                                        {
                                            activity.title
                                        }
                                    </p>
                                    <p className="mt-1 text-xs text-zinc-500">
                                        {
                                            activity.detail
                                        }
                                        {activity.timestamp
                                            ? ` · ${activity.timestamp}`
                                            : ''}
                                    </p>
                                </div>
                            </div>
                        )
                    )}
                </div>
            ) : (
                <p className="text-sm text-zinc-400">
                    No recent activity yet.
                </p>
            )}
        </div>
    )
}
