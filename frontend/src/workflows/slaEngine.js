export function calculateSLADeadline({
    createdAt,
    slaHours,
}) {
    const deadline = new Date(createdAt)

    deadline.setHours(
        deadline.getHours() + slaHours
    )

    return deadline
}

export function isOverdue(deadline) {
    return new Date() > new Date(deadline)
}