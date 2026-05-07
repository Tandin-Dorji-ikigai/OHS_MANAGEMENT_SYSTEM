import clsx from 'clsx'

const statusStyles = {
    pending: 'bg-yellow-500/10 text-yellow-400',
    approved: 'bg-emerald-500/10 text-emerald-400',
    rejected: 'bg-red-500/10 text-red-400',
    completed: 'bg-blue-500/10 text-blue-400',
    critical: 'bg-red-500/10 text-red-400',
}

export default function StatusBadge({ status }) {
    return (
        <span
            className={clsx(
                'rounded-full px-3 py-1 text-xs font-medium capitalize',
                statusStyles[status?.toLowerCase()] ||
                'bg-zinc-500/10 text-zinc-300'
            )}
        >
            {status}
        </span>
    )
}