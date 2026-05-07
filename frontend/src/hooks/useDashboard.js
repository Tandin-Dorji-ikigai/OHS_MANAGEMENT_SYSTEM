import {
    useQuery,
} from '@tanstack/react-query'

import {
    getDashboard,
    getDashboardMetrics,
    getHighRiskSites,
    getPendingApprovals,
    getRecentActivity,
    getRecentIncidents,
    getWorkflowAlerts,
} from '../services/dashboardService'

const defaultQueryOptions = {
    staleTime: 60 * 1000,
    retry: 2,
}

export function useDashboard() {
    return useQuery({
        queryKey: ['dashboard'],
        queryFn: getDashboard,
        ...defaultQueryOptions,
    })
}

export function useDashboardMetrics() {
    return useQuery({
        queryKey: ['dashboard-metrics'],
        queryFn: getDashboardMetrics,
        select: (data) =>
            data?.metrics ?? [],
        ...defaultQueryOptions,
    })
}

export function useRecentIncidents() {
    return useQuery({
        queryKey: ['recent-incidents'],
        queryFn:
            getRecentIncidents,
        ...defaultQueryOptions,
    })
}

export function usePendingApprovals() {
    return useQuery({
        queryKey: [
            'pending-approvals',
        ],
        queryFn:
            getPendingApprovals,
        ...defaultQueryOptions,
    })
}

export function useWorkflowAlerts() {
    return useQuery({
        queryKey: [
            'workflow-alerts',
        ],
        queryFn:
            getWorkflowAlerts,
        ...defaultQueryOptions,
    })
}

export function useHighRiskSites() {
    return useQuery({
        queryKey: [
            'high-risk-sites',
        ],
        queryFn:
            getHighRiskSites,
        select: (data) =>
            (
                data ?? []
            ).filter(
                (site) =>
                    site.status !==
                    'Safe'
            ),
        ...defaultQueryOptions,
    })
}

export function useRecentActivity() {
    return useQuery({
        queryKey: [
            'recent-activity',
        ],
        queryFn:
            getRecentActivity,
        ...defaultQueryOptions,
    })
}
