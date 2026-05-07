const timeline = [
    {
        title: 'Incident Reported',
        user: 'Sonam Dorji',
        time: '09:30 AM',
    },
    {
        title: 'Investigation Assigned',
        user: 'HQ Safety Officer',
        time: '10:15 AM',
    },
    {
        title: 'Corrective Actions Issued',
        user: 'Karma Wangchuk',
        time: '02:40 PM',
    },
]

export default function InvestigationTimeline() {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">

            <div className="mb-8">
                <h2 className="text-2xl font-bold">
                    Incident Timeline
                </h2>
            </div>

            <div className="space-y-6">
                {timeline.map((item, index) => (
                    <div
                        key={index}
                        className="flex gap-4"
                    >
                        <div className="mt-2 h-3 w-3 rounded-full bg-white" />

                        <div>
                            <h4 className="font-medium text-white">
                                {item.title}
                            </h4>

                            <p className="mt-1 text-sm text-zinc-400">
                                {item.user}
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                                {item.time}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}