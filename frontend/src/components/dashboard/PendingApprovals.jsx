export default function PendingApprovals({
    approvals = [],
    loading,
    error,
    onRetry,
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                    Pending Approvals
                </h3>

                <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
                    {loading
                        ? 'Loading'
                        : `${approvals.length} Pending`}
                </span>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {Array.from({
                        length: 2,
                    }).map((_, index) => (
                        <div
                            key={index}
                            className="animate-pulse rounded-xl border border-white/5 bg-white/[0.02] p-4"
                        >
                            <div className="h-4 w-28 rounded bg-white/5" />
                            <div className="mt-3 h-3 w-20 rounded bg-white/5" />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                    <p className="text-sm text-red-300">
                        Unable to load pending approvals.
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
            ) : approvals.length ? (
                <div className="space-y-4">
                    {approvals.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4"
                        >
                            <div>
                                <h4 className="font-medium">
                                    {item.type}
                                </h4>

                                <p className="mt-1 text-sm text-zinc-400">
                                    {item.site}
                                </p>

                                {item.date ? (
                                    <p className="mt-1 text-xs text-zinc-500">
                                        {item.status} · {item.date}
                                    </p>
                                ) : null}
                            </div>

                            <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200">
                                Review
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-zinc-400">
                    No approvals pending.
                </p>
            )}
        </div>
    )
}
