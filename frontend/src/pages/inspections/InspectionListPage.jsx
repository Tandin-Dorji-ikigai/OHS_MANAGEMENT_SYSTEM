import {
    Eye,
    Plus,
} from 'lucide-react'

import AppLayout from '../../components/layouts/AppLayout'

import DataTable from '../../components/tables/DataTable'
import TableHeader from '../../components/tables/TableHeader'
import StatusBadge from '../../components/tables/StatusBadge'

import { useNavigate } from 'react-router-dom'
import {
    useInspections,
} from '../../hooks/useInspections'
import SkeletonBlock from '../../components/common/SkeletonBlock'
import {
    formatLabel,
} from '../../utils/formatters'

export default function InspectionListPage() {

    const navigate = useNavigate()
    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useInspections()

    const inspections =
        data?.data?.map(
            (inspection) => ({
                id: inspection.id,
                site:
                    inspection.site
                        ?.name ??
                    'Unassigned site',
                officer:
                    [
                        inspection.creator
                            ?.firstName,
                        inspection.creator
                            ?.lastName,
                    ]
                        .filter(Boolean)
                        .join(' ') ||
                    'System User',
                score: `${Math.round(
                    Number(
                        inspection.complianceScore ??
                            0
                    )
                )}%`,
                status: formatLabel(
                    inspection.status
                ),
            })
        ) ?? []

    const columns = [
        {
            key: 'id',
            title: 'Inspection ID',
        },
        {
            key: 'site',
            title: 'Site',
        },
        {
            key: 'officer',
            title: 'Officer',
        },
        {
            key: 'score',
            title: 'Compliance Score',
        },
        {
            key: 'status',
            title: 'Status',
            render: (row) => (
                <StatusBadge status={row.status} />
            ),
        },
        {
            key: 'actions',
            title: 'Actions',
            render: () => (
                <button
                    className="
            flex items-center gap-2 rounded-lg border
            border-white/10 bg-white/[0.03]
            px-4 py-2 text-sm hover:bg-white/[0.05]
          "
                >
                    <Eye size={16} />

                    View
                </button>
            ),
        },
    ]

    return (
        <AppLayout>

            <TableHeader
                title="Inspections"
                description="Manage and monitor field inspections"
                action={
                    <button
                        className="
              flex items-center gap-2 rounded-xl bg-white
              px-5 py-3 text-sm font-semibold text-black
              hover:bg-zinc-200
            "

                        onClick={() => navigate('/inspections/create')}
                    >
                        <Plus size={18} />

                        New Inspection
                    </button>
                }
            />

            {isLoading ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="space-y-4">
                        {Array.from({
                            length: 4,
                        }).map(
                            (_, index) => (
                                <SkeletonBlock
                                    key={index}
                                    className="h-14"
                                />
                            )
                        )}
                    </div>
                </div>
            ) : isError ? (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                    <p className="text-sm text-red-300">
                        Unable to load inspections.
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
            ) : inspections.length ? (
                <DataTable
                    columns={columns}
                    data={inspections}
                />
            ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-zinc-400">
                    No inspections found.
                </div>
            )}
        </AppLayout>
    )
}
