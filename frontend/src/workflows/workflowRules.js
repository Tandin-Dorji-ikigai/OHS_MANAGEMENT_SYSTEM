export const workflowRules = {
    incidents: {
        critical: {
            autoEscalate: true,
            notifyHQ: true,
            notifyManagement: true,
            requiresImmediateApproval: true,
            slaHours: 1,
        },

        high: {
            autoEscalate: true,
            notifyHQ: true,
            slaHours: 4,
        },

        medium: {
            autoEscalate: false,
            notifyHQ: false,
            slaHours: 24,
        },
    },

    inspections: {
        failedCriticalItem: {
            autoCreateCAPA: true,
            notifySupervisor: true,
            requiresReview: true,
        },
    },
}