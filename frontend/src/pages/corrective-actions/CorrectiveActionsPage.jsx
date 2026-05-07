import AppLayout from '../../components/layouts/AppLayout'

import TableHeader from '../../components/tables/TableHeader'

import CorrectiveActionItem from '../../components/corrective-actions/CorrectiveActionItem'
import {
    useCorrectiveActions,
} from '../../hooks/useCorrectiveActions'
import SkeletonBlock from '../../components/common/SkeletonBlock'

export default function CorrectiveActionsPage() {
    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useCorrectiveActions()

    const correctiveActions =
        data?.data ?? []

    return (
        <AppLayout>

            <TableHeader
                title="Corrective Actions"
                description="Track and manage safety corrective actions"
            />

            {isLoading ? (
                <div className="space-y-6">
                    {Array.from({
                        length: 3,
                    }).map((_, index) => (
                        <SkeletonBlock
                            key={index}
                            className="h-40"
                        />
                    ))}
                </div>
            ) : isError ? (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                    <p className="text-sm text-red-300">
                        Unable to load corrective actions.
                    </p>
                    <button
                        type="button"
                        onClick={() =>
                            refetch()
                        }
                        className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200"
                    >
                        Retry
                    </button>
                </div>
            ) : correctiveActions.length ? (
                <div className="space-y-6">
                    {correctiveActions.map(
                        (item) => (
                            <CorrectiveActionItem
                                key={item.id}
                                item={item}
                            />
                        )
                    )}
                </div>
            ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-zinc-400">
                    No corrective actions found.
                </div>
            )}
        </AppLayout>
    )
}
