import {
    Calendar,
    User,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import CorrectiveActionStatusBadge from './CorrectiveActionStatusBadge'
import {
    formatDate,
} from '../../utils/formatters'

export default function CorrectiveActionItem({
    item,
}) {
    const assignedTo =
        [
            item.assignee?.firstName,
            item.assignee?.lastName,
        ]
            .filter(Boolean)
            .join(' ') ||
        item.assignedTo ||
        'Unassigned'
    const isOverdue =
        item.status === 'overdue'

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-start justify-between">

                <div>
                    <h3 className="text-lg font-semibold text-white">
                        {item.title}
                    </h3>

                    <p className="mt-2 text-sm text-zinc-400">
                        {item.description}
                    </p>

                    {item.sourceModule ? (
                        <p className="mt-2 text-xs text-zinc-500">
                            Source: {item.sourceModule}
                        </p>
                    ) : null}
                </div>

                <CorrectiveActionStatusBadge
                    status={item.status}
                />
            </div>

            <div className="mt-6 flex flex-wrap gap-6 text-sm text-zinc-400">

                <div className="flex items-center gap-2">
                    <User size={16} />

                    {assignedTo}
                </div>

                <div className="flex items-center gap-2">
                    <Calendar size={16} />

                    <span
                        className={
                            isOverdue
                                ? 'text-orange-300'
                                : undefined
                        }
                    >
                        Due: {formatDate(
                            item.dueDate
                        )}
                    </span>
                </div>
            </div>

            <div className="mt-6 flex gap-3">

                <Link
                    to={`/corrective-actions/${item.id}`}
                    className="
            rounded-xl bg-white px-5 py-3
            text-sm font-semibold text-black
            hover:bg-zinc-200
          "
                >
                    View Details
                </Link>

                <Link
                    to={`/corrective-actions/${item.id}`}
                    className="
            rounded-xl border border-white/10
            px-5 py-3 text-sm font-medium
            hover:bg-white/[0.03]
          "
                >
                    Upload Evidence
                </Link>
            </div>
        </div>
    )
}
