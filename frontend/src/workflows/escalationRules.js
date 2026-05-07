export function shouldEscalateIncident(
    incident
) {
    return (
        incident.severity === 'critical' ||
        incident.severity === 'high'
    )
}

export function shouldEscalateCAPA(
    capa
) {
    return capa.status === 'overdue'
}