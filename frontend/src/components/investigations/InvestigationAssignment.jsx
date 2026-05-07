import FormInput from '../forms/FormInput'
import FormSelect from '../forms/FormSelect'

export default function InvestigationAssignment() {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">

            <div className="mb-8">
                <h2 className="text-2xl font-bold">
                    Investigation Assignment
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                    Assign investigator and define investigation priority
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

                <FormInput
                    label="Assigned Investigator"
                    placeholder="Enter investigator name"
                />

                <FormSelect
                    label="Investigation Priority"
                    options={[
                        'Low',
                        'Medium',
                        'High',
                        'Critical',
                    ]}
                />

                <FormInput
                    label="Investigation Deadline"
                    type="date"
                />

                <FormSelect
                    label="Investigation Status"
                    options={[
                        'Assigned',
                        'Investigating',
                        'Pending HQ Review',
                        'Closed',
                    ]}
                />
            </div>
        </div>
    )
}