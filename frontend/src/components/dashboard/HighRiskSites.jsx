export default function HighRiskSites({
    sites = [],
    loading,
    error,
    onRetry,
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-6 text-lg font-semibold">
                High Risk Sites
            </h3>

            {loading ? (
                <div className="space-y-4">
                    {Array.from({
                        length: 3,
                    }).map((_, index) => (
                        <div
                            key={index}
                            className="animate-pulse rounded-xl border border-white/5 bg-white/[0.02] p-4"
                        >
                            <div className="h-4 w-36 rounded bg-white/5" />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                    <p className="text-sm text-red-300">
                        Unable to load high-risk sites.
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
            ) : sites.length ? (
                <div className="space-y-4">
                    {sites.map((site) => (
                        <div
                            key={site.siteId}
                            className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium">
                                        {site.label}
                                    </h4>
                                    <p className="mt-1 text-sm text-zinc-400">
                                        {site.region}
                                    </p>
                                    <p className="mt-1 text-xs text-zinc-500">
                                        {site.openIncidents} open incidents · {site.overdueActions} overdue CAPAs
                                    </p>
                                </div>

                                <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                                    {site.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-zinc-400">
                    No high-risk sites found.
                </p>
            )}
        </div>
    )
}
