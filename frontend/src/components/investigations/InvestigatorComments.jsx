import FormTextarea from '../forms/FormTextarea'

export default function InvestigatorComments() {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">

            <div className="mb-8">
                <h2 className="text-2xl font-bold">
                    Investigator Notes
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                    Record findings and investigation progress
                </p>
            </div>

            <div className="space-y-6">

                <FormTextarea
                    label="Investigation Summary"
                    placeholder="Enter investigation findings..."
                />

                <FormTextarea
                    label="Witness Statements"
                    placeholder="Record witness observations..."
                />

                <FormTextarea
                    label="Recommended Actions"
                    placeholder="Enter recommendations..."
                />
            </div>
        </div>
    )
}