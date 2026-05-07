import api from '../api/axios'
import {
    unwrapResponse,
} from '../utils/api'

const DASHBOARD_BASE_PATH =
    '/dashboard'

export async function getDashboard() {
    const response = await api.get(
        DASHBOARD_BASE_PATH
    )

    return unwrapResponse(response)
}

export async function getDashboardMetrics() {
    const response = await api.get(
        `${DASHBOARD_BASE_PATH}/metrics`
    )

    return unwrapResponse(response)
}

export async function getRecentIncidents() {
    const response = await api.get(
        `${DASHBOARD_BASE_PATH}/recent-incidents`
    )

    return unwrapResponse(response)
}

export async function getPendingApprovals() {
    const response = await api.get(
        `${DASHBOARD_BASE_PATH}/pending-approvals`
    )

    return unwrapResponse(response)
}

export async function getWorkflowAlerts() {
    const response = await api.get(
        `${DASHBOARD_BASE_PATH}/workflow-alerts`
    )

    return unwrapResponse(response)
}

export async function getHighRiskSites() {
    const response = await api.get(
        `${DASHBOARD_BASE_PATH}/high-risk-sites`
    )

    return unwrapResponse(response)
}

export async function getRecentActivity() {
    const response = await api.get(
        `${DASHBOARD_BASE_PATH}/recent-activity`
    )

    return unwrapResponse(response)
}
