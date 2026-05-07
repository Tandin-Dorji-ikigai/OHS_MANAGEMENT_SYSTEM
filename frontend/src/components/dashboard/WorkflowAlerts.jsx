export default function WorkflowAlerts({
    alerts = [],
    loading,
    error,
    onRetry,
}) {
    return (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-red-400">
                    Workflow Alerts
                </h3>

                <p className="mt-1 text-sm text-zinc-300">
                    Automated escalation monitoring
                </p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {Array.from({
                        length: 2,
                    }).map((_, index) => (
                        <div
                            key={index}
                            className="animate-pulse rounded-xl bg-black/20 p-4"
                        >
                            <div className="h-4 w-40 rounded bg-white/5" />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-xl bg-black/20 p-4">
                    <p className="text-sm text-red-300">
                        Unable to load workflow alerts.
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
            ) : alerts.length ? (
                <div className="space-y-4">
                    {alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className="rounded-xl bg-black/20 p-4"
                        >
                            <p className="text-sm text-white">
                                {alert.title}
                            </p>
                            <p className="mt-1 text-xs text-zinc-400">
                                {alert.site} - {alert.stamp}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-zinc-300">
                    No workflow alerts at the moment.
                </p>
            )}
        </div>
    )
}
