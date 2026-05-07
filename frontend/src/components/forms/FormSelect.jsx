import {
    Field,
    Label,
    Select,
} from '@headlessui/react'

import clsx from 'clsx'

export default function FormSelect({
    label,
    options = [],
    getOptionLabel,
    getOptionValue,
    ...props
}) {
    return (
        <Field>
            <Label className="text-sm font-medium text-white">
                {label}
            </Label>

            <Select
                {...props}
                className={clsx(
                    'mt-3 block w-full rounded-xl border border-white/10',
                    'bg-white/[0.03] px-4 py-3 text-sm text-white',
                    'focus:outline-none focus:ring-2 focus:ring-white/10',
                    props.className
                )}
            >
                {options.map((option) => (
                    <option
                        key={
                            getOptionValue
                                ? getOptionValue(
                                      option
                                  )
                                : option
                        }
                        value={
                            getOptionValue
                                ? getOptionValue(
                                      option
                                  )
                                : option
                        }
                        className="bg-zinc-900"
                    >
                        {getOptionLabel
                            ? getOptionLabel(
                                  option
                              )
                            : option}
                    </option>
                ))}
            </Select>
        </Field>
    )
}
