import {
    workflowRules,
} from './workflowRules'

import {
    calculateSLADeadline,
} from './slaEngine'

import {
    shouldEscalateIncident,
} from './escalationRules'

import {
    getNotificationTriggers,
} from './notificationTriggers'

class WorkflowEngine {
    processIncident(incident) {
        const rule =
            workflowRules.incidents[
            incident.severity?.toLowerCase()
            ]

        const deadline =
            calculateSLADeadline({
                createdAt: new Date(),
                slaHours: rule.slaHours,
            })

        const escalation =
            shouldEscalateIncident(incident)

        const notifications =
            getNotificationTriggers(
                'incident_created',
                incident
            )

        return {
            escalation,
            deadline,
            notifications,
            autoApprove:
                rule.requiresImmediateApproval,
        }
    }
}

export default new WorkflowEngine()