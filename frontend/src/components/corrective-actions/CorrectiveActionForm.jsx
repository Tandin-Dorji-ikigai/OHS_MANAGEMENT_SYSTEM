import FormInput from '../forms/FormInput'
import FormTextarea from '../forms/FormTextarea'
import FormSelect from '../forms/FormSelect'

export default function CorrectiveActionForm() {
    return (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8">

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">
                    Corrective Action
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                    Create corrective actions for failed inspection items
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

                <FormInput
                    label="Issue Title"
                    placeholder="Unsafe electrical wiring"
                />

                <FormSelect
                    label="Priority"
                    options={[
                        'Low',
                        'Medium',
                        'High',
                        'Critical',
                    ]}
                />

                <FormInput
                    label="Responsible Person"
                    placeholder="Enter responsible person"
                />

                <FormInput
                    label="Due Date"
                    type="date"
                />
            </div>

            <div className="mt-6">

                <FormTextarea
                    label="Corrective Action Required"
                    placeholder="Describe required corrective measures..."
                />
            </div>
        </div>
    )
}