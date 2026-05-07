import clsx from 'clsx'

export default function DashboardStatCard({
    title,
    value,
    change,
    icon: Icon,
    danger,
    loading,
}) {
    if (loading) {
        return (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 w-24 rounded bg-white/5" />
                    <div className="h-10 w-20 rounded bg-white/5" />
                    <div className="h-4 w-32 rounded bg-white/5" />
                </div>
            </div>
        )
    }

    return (
        <div
            className={clsx(
                'rounded-2xl border border-white/10 bg-white/[0.03] p-6',
                'backdrop-blur-xl'
            )}
        >
            <div className="flex items-start justify-between">

                <div>
                    <p className="text-sm text-zinc-400">
                        {title}
                    </p>

                    <h3 className="mt-3 text-3xl font-bold text-white">
                        {value}
                    </h3>
                </div>

                <div
                    className={clsx(
                        'rounded-xl p-3',
                        danger
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-white/10 text-white'
                    )}
                >
                    <Icon size={20} />
                </div>
            </div>

            <div className="mt-6">
                <p
                    className={clsx(
                        'text-sm font-medium',
                        danger
                            ? 'text-red-400'
                            : 'text-emerald-400'
                    )}
                >
                    {change}
                </p>
            </div>
        </div>
    )
}
