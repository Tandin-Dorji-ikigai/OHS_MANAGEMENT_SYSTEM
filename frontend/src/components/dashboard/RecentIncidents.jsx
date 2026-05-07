export default function RecentIncidents({
    incidents = [],
    loading,
    error,
    onRetry,
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                    Recent Incidents
                </h3>

                <button className="text-sm text-zinc-400 hover:text-white">
                    View all
                </button>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {Array.from({
                        length: 3,
                    }).map((_, index) => (
                        <div
                            key={index}
                            className="animate-pulse rounded-xl border border-white/5 bg-white/[0.02] p-4"
                        >
                            <div className="h-4 w-32 rounded bg-white/5" />
                            <div className="mt-3 h-3 w-24 rounded bg-white/5" />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                    <p className="text-sm text-red-300">
                        Unable to load recent incidents.
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
            ) : incidents.length ? (
                <div className="space-y-4">
                    {incidents.map(
                        (incident) => (
                            <div
                                key={
                                    incident.id
                                }
                                className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">
                                            {incident.title}
                                        </h4>

                                        <p className="mt-1 text-sm text-zinc-400">
                                            {incident.site}
                                        </p>

                                        {incident.timestamp ? (
                                            <p className="mt-1 text-xs text-zinc-500">
                                                {incident.timestamp}
                                            </p>
                                        ) : null}
                                    </div>

                                    <span
                                        className={
                                            incident.severity?.toLowerCase() ===
                                            'critical'
                                                ? 'rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400'
                                                : 'rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400'
                                        }
                                    >
                                        {
                                            incident.severity
                                        }
                                    </span>
                                </div>
                            </div>
                        )
                    )}
                </div>
            ) : (
                <p className="text-sm text-zinc-400">
                    No recent incidents found.
                </p>
            )}
        </div>
    )
}
