export default function EscalationPanel({
    incident,
    escalations = [],
}) {
    const isCritical =
        incident?.severity ===
        'critical'
    const isOverdue =
        incident?.status ===
            'under_review' &&
        incident?.eventDate &&
        new Date(incident.eventDate) <
            new Date(
                Date.now() -
                    3 *
                        24 *
                        60 *
                        60 *
                        1000
            )

    return (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8">

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-red-400">
                    Escalation Rules
                </h2>

                <p className="mt-2 text-sm text-zinc-300">
                    Critical incidents require immediate escalation
                </p>
            </div>

            <div className="space-y-4 text-sm text-zinc-300">

                <div className="rounded-xl bg-black/20 p-4">
                    {isCritical
                        ? 'Critical incident is currently escalated to HQ.'
                        : 'Critical incidents notify HQ immediately.'}
                </div>

                <div className="rounded-xl bg-black/20 p-4">
                    {incident?.peopleInvolved
                        ?.some((person) =>
                            String(
                                person.role
                            )
                                .toLowerCase()
                                .includes(
                                    'fatality'
                                )
                        )
                        ? 'Fatality metadata detected. Management escalation is required.'
                        : 'Fatalities trigger management escalation.'}
                </div>

                <div className="rounded-xl bg-black/20 p-4">
                    {isOverdue
                        ? 'Investigation is overdue and should be escalated for follow-up.'
                        : 'Overdue investigations trigger reminders.'}
                </div>

                {escalations.length ? (
                    <div className="rounded-xl bg-black/20 p-4">
                        Latest escalation:{' '}
                        {
                            escalations[0]
                                .detail ??
                            escalations[0]
                                .reason
                        }
                    </div>
                ) : null}
            </div>
        </div>
    )
}
