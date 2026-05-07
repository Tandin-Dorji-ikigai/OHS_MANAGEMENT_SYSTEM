import {
    useAuth,
} from '../../hooks/useAuth'
import {
    FEATURE_PERMISSIONS,
    hasPermission,
} from '../../utils/permissions'

export default function IncidentApprovalPanel() {
    const { user } = useAuth()

    if (
        !hasPermission(
            user,
            FEATURE_PERMISSIONS.APPROVE_INCIDENTS
        )
    ) {
        return null
    }

    return (
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-8">

            <div className="mb-8">
                <h2 className="text-2xl font-bold">
                    HQ Review & Approval
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                    Final management review and approval process
                </p>
            </div>

            <div className="flex flex-wrap gap-4">

                <button
                    className="
            rounded-xl bg-emerald-500 px-6 py-3
            text-sm font-semibold text-white
            hover:bg-emerald-400
          "
                >
                    Approve Investigation
                </button>

                <button
                    className="
            rounded-xl bg-red-500 px-6 py-3
            text-sm font-semibold text-white
            hover:bg-red-400
          "
                >
                    Reject
                </button>

                <button
                    className="
            rounded-xl border border-white/10
            px-6 py-3 text-sm font-medium
            hover:bg-white/[0.03]
          "
                >
                    Request Revision
                </button>
            </div>
        </div>
    )
}
