import {
    Eye,
    Plus,
} from 'lucide-react'
import {
    useMemo,
    useState,
} from 'react'

import { useNavigate } from 'react-router-dom'

import AppLayout from '../../components/layouts/AppLayout'

import DataTable from '../../components/tables/DataTable'
import TableHeader from '../../components/tables/TableHeader'

import IncidentSeverityBadge from '../../components/incidents/IncidentSeverityBadge'
import FormSelect from '../../components/forms/FormSelect'
import {
    useIncidents,
} from '../../hooks/useIncidents'
import SkeletonBlock from '../../components/common/SkeletonBlock'
import {
    formatLabel,
} from '../../utils/formatters'

export default function IncidentListPage() {
    const navigate = useNavigate()
    const [severity, setSeverity] =
        useState('')
    const [status, setStatus] =
        useState('')
    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useIncidents({
        ...(severity
            ? { severity }
            : {}),
        ...(status
            ? { status }
            : {}),
    })

    const incidents = useMemo(
        () =>
            data?.data?.map(
                (incident) => ({
                    id: incident.id,
                    title:
                        incident.location,
                    site:
                        incident.site
                            ?.name ??
                        'Unassigned site',
                    severity: formatLabel(
                        incident.severity
                    ),
                    status: formatLabel(
                        incident.status
                    ),
                })
            ) ?? [],
        [data]
    )

    const columns = [
        {
            key: 'id',
            title: 'Incident ID',
        },
        {
            key: 'title',
            title: 'Incident',
        },
        {
            key: 'site',
            title: 'Site',
        },
        {
            key: 'severity',
            title: 'Severity',
            render: (row) => (
                <IncidentSeverityBadge
                    severity={row.severity}
                />
            ),
        },
        {
            key: 'status',
            title: 'Status',
        },
        {
            key: 'actions',
            title: 'Actions',
            render: (row) => (
                <button
                    className="
            flex items-center gap-2 rounded-lg border
            border-white/10 bg-white/[0.03]
            px-4 py-2 text-sm hover:bg-white/[0.05]
          "

                    onClick={() =>
                        navigate(`/incidents/${row.id}`)
                    }
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
                title="Incident Management"
                description="Track and investigate safety incidents"
                action={
                    <>
                        <FormSelect
                            label=""
                            value={severity}
                            onChange={(
                                event
                            ) =>
                                setSeverity(
                                    event
                                        .target
                                        .value
                                )
                            }
                            options={[
                                {
                                    value: '',
                                    label: 'All Severity',
                                },
                                {
                                    value: 'minor',
                                    label: 'Low',
                                },
                                {
                                    value: 'moderate',
                                    label: 'Medium',
                                },
                                {
                                    value: 'major',
                                    label: 'High',
                                },
                                {
                                    value: 'critical',
                                    label: 'Critical',
                                },
                            ]}
                            getOptionLabel={(
                                option
                            ) =>
                                option.label
                            }
                            getOptionValue={(
                                option
                            ) =>
                                option.value
                            }
                            className="mt-0 h-11 min-w-[150px]"
                        />

                        <FormSelect
                            label=""
                            value={status}
                            onChange={(
                                event
                            ) =>
                                setStatus(
                                    event
                                        .target
                                        .value
                                )
                            }
                            options={[
                                {
                                    value: '',
                                    label: 'All Status',
                                },
                                {
                                    value: 'draft',
                                    label: 'Draft',
                                },
                                {
                                    value: 'submitted',
                                    label: 'Reported',
                                },
                                {
                                    value: 'under_review',
                                    label: 'Investigating',
                                },
                                {
                                    value: 'validated',
                                    label: 'Pending HQ Review',
                                },
                                {
                                    value: 'approved',
                                    label: 'Approved',
                                },
                                {
                                    value: 'rejected',
                                    label: 'Rejected',
                                },
                                {
                                    value: 'closed',
                                    label: 'Closed',
                                },
                            ]}
                            getOptionLabel={(
                                option
                            ) =>
                                option.label
                            }
                            getOptionValue={(
                                option
                            ) =>
                                option.value
                            }
                            className="mt-0 h-11 min-w-[180px]"
                        />

                        <button
                            onClick={() =>
                                navigate('/incidents/create')
                            }
                            className="
              flex items-center gap-2 rounded-xl bg-white
              px-5 py-3 text-sm font-semibold text-black
              hover:bg-zinc-200
            "
                        >
                            <Plus size={18} />

                            Report Incident
                        </button>
                    </>
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
                        Unable to load incidents.
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
            ) : incidents.length ? (
                <DataTable
                    columns={columns}
                    data={incidents}
                />
            ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-zinc-400">
                    No incidents found.
                </div>
            )}
        </AppLayout>
    )
}
