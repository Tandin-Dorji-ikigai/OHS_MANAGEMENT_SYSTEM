export default function EscalationPanel() {
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
                    Critical incidents notify HQ immediately
                </div>

                <div className="rounded-xl bg-black/20 p-4">
                    Fatalities trigger management escalation
                </div>

                <div className="rounded-xl bg-black/20 p-4">
                    Overdue investigations trigger reminders
                </div>
            </div>
        </div>
    )
}