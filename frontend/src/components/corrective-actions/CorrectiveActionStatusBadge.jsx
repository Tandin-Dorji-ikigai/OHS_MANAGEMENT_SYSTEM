import clsx from 'clsx'

const styles = {
    open: 'bg-red-500/10 text-red-400',
    in_progress:
        'bg-yellow-500/10 text-yellow-400',
    progress: 'bg-yellow-500/10 text-yellow-400',
    pending_verification:
        'bg-blue-500/10 text-blue-300',
    closed: 'bg-emerald-500/10 text-emerald-400',
    completed: 'bg-emerald-500/10 text-emerald-400',
    overdue: 'bg-orange-500/10 text-orange-400',
}

export default function CorrectiveActionStatusBadge({
    status,
}) {
    return (
        <span
            className={clsx(
                'rounded-full px-3 py-1 text-xs font-medium capitalize',
                styles[status] || 'bg-zinc-500/10 text-zinc-300'
            )}
        >
            {status}
        </span>
    )
}
