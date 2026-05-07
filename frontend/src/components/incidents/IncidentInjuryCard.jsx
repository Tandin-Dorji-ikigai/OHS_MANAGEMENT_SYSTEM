import FormInput from '../forms/FormInput'
import FormSelect from '../forms/FormSelect'

export default function IncidentInjuryCard({
    values,
    onChange,
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold">
                    Injury Tracking
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                    Record injury information
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <FormInput
                    label="Affected Person"
                    placeholder="Enter worker name"
                    value={
                        values.affectedPerson
                    }
                    onChange={(event) =>
                        onChange(
                            'affectedPerson',
                            event.target.value
                        )
                    }
                />

                <FormSelect
                    label="Injury Severity"
                    options={[
                        'Minor',
                        'Medical Treatment',
                        'Lost Time Injury',
                        'Fatality',
                    ]}
                    value={
                        values.injurySeverity
                    }
                    onChange={(event) =>
                        onChange(
                            'injurySeverity',
                            event.target.value
                        )
                    }
                />

                <FormInput
                    label="Body Part Affected"
                    placeholder="Enter affected area"
                    value={
                        values.bodyPartAffected
                    }
                    onChange={(event) =>
                        onChange(
                            'bodyPartAffected',
                            event.target.value
                        )
                    }
                />

                <FormInput
                    label="Days Lost"
                    type="number"
                    min="0"
                    value={values.daysLost}
                    onChange={(event) =>
                        onChange(
                            'daysLost',
                            event.target.value
                        )
                    }
                />
            </div>
        </div>
    )
}
