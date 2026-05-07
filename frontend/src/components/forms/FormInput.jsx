import {
    Field,
    Input,
    Label,
} from '@headlessui/react'

import clsx from 'clsx'

export default function FormInput({
    label,
    placeholder,
    type = 'text',
    ...props
}) {
    return (
        <Field>
            <Label className="text-sm font-medium text-white">
                {label}
            </Label>

            <Input
                type={type}
                placeholder={placeholder}
                {...props}
                className={clsx(
                    'mt-3 block w-full rounded-xl border border-white/10',
                    'bg-white/[0.03] px-4 py-3 text-sm text-white',
                    'placeholder:text-zinc-500',
                    'focus:outline-none focus:ring-2 focus:ring-white/10',
                    props.className
                )}
            />
        </Field>
    )
}
