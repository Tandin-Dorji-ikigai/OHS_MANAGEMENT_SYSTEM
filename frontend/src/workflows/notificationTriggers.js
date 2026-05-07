export function getNotificationTriggers(
    type,
    payload
) {
    const notifications = []

    if (
        type === 'incident_created' &&
        payload.severity === 'critical'
    ) {
        notifications.push({
            role: 'HQ_OFFICER',
            title: 'Critical incident reported',
        })

        notifications.push({
            role: 'MANAGEMENT',
            title: 'Critical incident escalation',
        })
    }

    return notifications
}