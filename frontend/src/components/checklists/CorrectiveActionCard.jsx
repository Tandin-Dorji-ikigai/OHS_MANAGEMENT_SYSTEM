export default function CorrectiveActionCard({
    issue,
}) {
    return (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">

            <div className="flex items-start justify-between">

                <div>
                    <h4 className="font-semibold text-red-400">
                        Corrective Action Required
                    </h4>

                    <p className="mt-2 text-sm text-zinc-300">
                        {issue}
                    </p>
                </div>

                <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                    Open
                </span>
            </div>
        </div>
    )
}