import clsx from 'clsx'

const severityStyles = {
    low: 'bg-blue-500/10 text-blue-400',
    medium: 'bg-yellow-500/10 text-yellow-400',
    high: 'bg-orange-500/10 text-orange-400',
    critical: 'bg-red-500/10 text-red-400',
}

export default function IncidentSeverityBadge({
    severity,
}) {
    return (
        <span
            className={clsx(
                'rounded-full px-3 py-1 text-xs font-medium capitalize',
                severityStyles[severity?.toLowerCase()] ||
                'bg-zinc-500/10 text-zinc-300'
            )}
        >
            {severity}
        </span>
    )
}