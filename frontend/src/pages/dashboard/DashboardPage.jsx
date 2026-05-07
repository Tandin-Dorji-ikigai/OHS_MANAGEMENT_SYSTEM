import {
    AlertTriangle,
    ClipboardCheck,
    ShieldAlert,
    Users,
} from 'lucide-react'

import AppLayout from '../../components/layouts/AppLayout'

import DashboardStatCard from '../../components/dashboard/DashboardStatCard'
import RecentIncidents from '../../components/dashboard/RecentIncidents'
import PendingApprovals from '../../components/dashboard/PendingApprovals'
import HighRiskSites from '../../components/dashboard/HighRiskSites'
import RecentActivity from '../../components/dashboard/RecentActivity'
import WorkflowAlerts from '../../components/dashboard/WorkflowAlerts'
import {
    useDashboard,
    useDashboardMetrics,
    useHighRiskSites,
    usePendingApprovals,
    useRecentActivity,
    useRecentIncidents,
    useWorkflowAlerts,
} from '../../hooks/useDashboard'

export default function DashboardPage() {
    const {
        isError,
        refetch,
    } = useDashboard()
    const metricsQuery =
        useDashboardMetrics()
    const recentIncidentsQuery =
        useRecentIncidents()
    const approvalsQuery =
        usePendingApprovals()
    const alertsQuery =
        useWorkflowAlerts()
    const highRiskSitesQuery =
        useHighRiskSites()
    const recentActivityQuery =
        useRecentActivity()

    const metrics =
        metricsQuery.data ?? []
    const incidentMetric =
        metrics.find(
            (metric) =>
                metric.key ===
                'incidentAlerts'
        ) ??
        metrics.find((metric) =>
            String(
                metric.key
            ).toLowerCase()
                .includes('incident')
        )

    return (
        <AppLayout>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    OHS Dashboard
                </h1>

                <p className="mt-2 text-zinc-400">
                    Monitor operational safety performance
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {(metricsQuery.isLoading
                    ? Array.from({
                          length: 4,
                      }).map(
                          (_, index) => ({
                              key: `skeleton-${index}`,
                          })
                      )
                    : metrics
                ).map((metric, index) => {
                    const icons = [
                        ClipboardCheck,
                        AlertTriangle,
                        ShieldAlert,
                        Users,
                    ]
                    const Icon =
                        icons[
                            index %
                                icons.length
                        ]

                    return (
                        <DashboardStatCard
                            key={
                                metric.key
                            }
                            title={
                                metric.label
                            }
                            value={
                                metricsQuery.isLoading
                                    ? ''
                                    : metric.value
                            }
                            change={
                                metricsQuery.isLoading
                                    ? ''
                                    : metric.detail
                            }
                            icon={Icon}
                            loading={
                                metricsQuery.isLoading
                            }
                            danger={
                                !metricsQuery.isLoading &&
                                metric.key ===
                                    incidentMetric?.key
                            }
                        />
                    )
                })}
            </div>

            {isError ? (
                <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                    <p className="text-sm text-red-300">
                        Unable to load dashboard data.
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
            ) : null}

            <div className="mt-8">
                <WorkflowAlerts
                    alerts={
                        alertsQuery.data
                    }
                    loading={
                        alertsQuery.isLoading
                    }
                    error={
                        alertsQuery.isError
                    }
                    onRetry={() =>
                        alertsQuery.refetch()
                    }
                />
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-3">

                <div className="space-y-6 xl:col-span-2">
                    <RecentIncidents
                        incidents={
                            recentIncidentsQuery.data
                        }
                        loading={
                            recentIncidentsQuery.isLoading
                        }
                        error={
                            recentIncidentsQuery.isError
                        }
                        onRetry={() =>
                            recentIncidentsQuery.refetch()
                        }
                    />
                    <PendingApprovals
                        approvals={
                            approvalsQuery.data
                        }
                        loading={
                            approvalsQuery.isLoading
                        }
                        error={
                            approvalsQuery.isError
                        }
                        onRetry={() =>
                            approvalsQuery.refetch()
                        }
                    />
                </div>

                <div className="space-y-6">
                    <HighRiskSites
                        sites={
                            highRiskSitesQuery.data
                        }
                        loading={
                            highRiskSitesQuery.isLoading
                        }
                        error={
                            highRiskSitesQuery.isError
                        }
                        onRetry={() =>
                            highRiskSitesQuery.refetch()
                        }
                    />
                    <RecentActivity
                        activities={
                            recentActivityQuery.data
                        }
                        loading={
                            recentActivityQuery.isLoading
                        }
                        error={
                            recentActivityQuery.isError
                        }
                        onRetry={() =>
                            recentActivityQuery.refetch()
                        }
                    />
                </div>
            </div>

        </AppLayout>
    )
}
