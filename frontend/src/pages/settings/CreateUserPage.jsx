import {
    Field,
    Input,
    Label,
    Select,
} from '@headlessui/react'
import clsx from 'clsx'
import {
    useEffect,
    useState,
} from 'react'

import AppLayout from '../../components/layouts/AppLayout'
import SectionTitle from '../../components/forms/SectionTitle'
import {
    createUser,
    getUserManagementOptions,
} from '../../services/userService'

const inputClassName = clsx(
    'mt-3 block w-full rounded-xl border border-white/10',
    'bg-white/5 px-4 py-3 text-sm text-white',
    'placeholder:text-zinc-500',
    'focus:outline-none focus:ring-2 focus:ring-white/20'
)

const initialFormState = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    employeeCode: '',
    password: '',
    department: '',
    teamName: '',
    roleId: '',
    siteIds: [],
}

export default function CreateUserPage() {
    const [form, setForm] = useState(
        initialFormState
    )
    const [roles, setRoles] = useState([])
    const [sites, setSites] = useState([])
    const [isLoadingOptions, setIsLoadingOptions] =
        useState(true)
    const [isSubmitting, setIsSubmitting] =
        useState(false)
    const [error, setError] =
        useState('')
    const [successMessage, setSuccessMessage] =
        useState('')

    useEffect(() => {
        let isMounted = true

        async function loadOptions() {
            setIsLoadingOptions(true)

            try {
                const options =
                    await getUserManagementOptions()

                if (!isMounted) {
                    return
                }

                const nextRoles =
                    options?.roles ?? []
                const nextSites =
                    options?.sites ?? []

                setRoles(nextRoles)
                setSites(nextSites)
                setForm((currentForm) => ({
                    ...currentForm,
                    roleId:
                        currentForm.roleId ||
                        nextRoles[0]?.id ||
                        '',
                }))
            } catch (loadError) {
                if (isMounted) {
                    setError(
                        loadError.response?.data
                            ?.message ??
                            'Unable to load user management options.'
                    )
                }
            } finally {
                if (isMounted) {
                    setIsLoadingOptions(
                        false
                    )
                }
            }
        }

        loadOptions()

        return () => {
            isMounted = false
        }
    }, [])

    function updateField(field, value) {
        setForm((currentForm) => ({
            ...currentForm,
            [field]: value,
        }))
    }

    function toggleSite(siteId) {
        setForm((currentForm) => {
            const nextSiteIds =
                currentForm.siteIds.includes(
                    siteId
                )
                    ? currentForm.siteIds.filter(
                          (id) => id !== siteId
                      )
                    : [
                          ...currentForm.siteIds,
                          siteId,
                      ]

            return {
                ...currentForm,
                siteIds: nextSiteIds,
            }
        })
    }

    async function handleSubmit(
        event
    ) {
        event.preventDefault()
        setError('')
        setSuccessMessage('')
        setIsSubmitting(true)

        try {
            const createdUser =
                await createUser({
                    ...form,
                    isActive: true,
                })

            setSuccessMessage(
                `User ${createdUser.email} created successfully.`
            )
            setForm({
                ...initialFormState,
                roleId:
                    roles[0]?.id ?? '',
            })
        } catch (submitError) {
            setError(
                submitError.response?.data
                    ?.message ??
                    'Unable to create user.'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AppLayout>
            <div className="mx-auto max-w-5xl space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">
                        User Management
                    </h1>

                    <p className="mt-2 text-zinc-400">
                        Create users and assign roles and sites.
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                    <SectionTitle
                        title="Create User"
                        description="This action is restricted to HQ administrators."
                    />

                    <form
                        className="space-y-8"
                        onSubmit={handleSubmit}
                    >
                        <div className="grid gap-6 md:grid-cols-2">
                            <Field>
                                <Label className="text-sm font-medium text-white">
                                    First Name
                                </Label>

                                <Input
                                    value={form.firstName}
                                    onChange={(event) =>
                                        updateField(
                                            'firstName',
                                            event.target.value
                                        )
                                    }
                                    className={inputClassName}
                                    placeholder="System"
                                />
                            </Field>

                            <Field>
                                <Label className="text-sm font-medium text-white">
                                    Last Name
                                </Label>

                                <Input
                                    value={form.lastName}
                                    onChange={(event) =>
                                        updateField(
                                            'lastName',
                                            event.target.value
                                        )
                                    }
                                    className={inputClassName}
                                    placeholder="Admin"
                                />
                            </Field>

                            <Field>
                                <Label className="text-sm font-medium text-white">
                                    Email
                                </Label>

                                <Input
                                    type="email"
                                    value={form.email}
                                    onChange={(event) =>
                                        updateField(
                                            'email',
                                            event.target.value
                                        )
                                    }
                                    className={inputClassName}
                                    placeholder="user@example.com"
                                />
                            </Field>

                            <Field>
                                <Label className="text-sm font-medium text-white">
                                    Employee Code
                                </Label>

                                <Input
                                    value={form.employeeCode}
                                    onChange={(event) =>
                                        updateField(
                                            'employeeCode',
                                            event.target.value
                                        )
                                    }
                                    className={inputClassName}
                                    placeholder="EMP-001"
                                />
                            </Field>

                            <Field>
                                <Label className="text-sm font-medium text-white">
                                    Phone Number
                                </Label>

                                <Input
                                    value={form.phoneNumber}
                                    onChange={(event) =>
                                        updateField(
                                            'phoneNumber',
                                            event.target.value
                                        )
                                    }
                                    className={inputClassName}
                                    placeholder="+975 17 000 000"
                                />
                            </Field>

                            <Field>
                                <Label className="text-sm font-medium text-white">
                                    Password
                                </Label>

                                <Input
                                    type="password"
                                    value={form.password}
                                    onChange={(event) =>
                                        updateField(
                                            'password',
                                            event.target.value
                                        )
                                    }
                                    className={inputClassName}
                                    placeholder="********"
                                />
                            </Field>

                            <Field>
                                <Label className="text-sm font-medium text-white">
                                    Department
                                </Label>

                                <Input
                                    value={form.department}
                                    onChange={(event) =>
                                        updateField(
                                            'department',
                                            event.target.value
                                        )
                                    }
                                    className={inputClassName}
                                    placeholder="Administration"
                                />
                            </Field>

                            <Field>
                                <Label className="text-sm font-medium text-white">
                                    Team Name
                                </Label>

                                <Input
                                    value={form.teamName}
                                    onChange={(event) =>
                                        updateField(
                                            'teamName',
                                            event.target.value
                                        )
                                    }
                                    className={inputClassName}
                                    placeholder="HQ Administration"
                                />
                            </Field>

                            <Field className="md:col-span-2">
                                <Label className="text-sm font-medium text-white">
                                    Role
                                </Label>

                                <Select
                                    value={form.roleId}
                                    onChange={(event) =>
                                        updateField(
                                            'roleId',
                                            event.target.value
                                        )
                                    }
                                    disabled={isLoadingOptions}
                                    className={inputClassName}
                                >
                                    {roles.map((role) => (
                                        <option
                                            key={role.id}
                                            value={role.id}
                                            className="bg-zinc-900"
                                        >
                                            {role.label}
                                        </option>
                                    ))}
                                </Select>
                            </Field>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-white">
                                Site Access
                            </h3>

                            <p className="mt-1 text-sm text-zinc-400">
                                Select one or more active sites for the new user.
                            </p>

                            <div className="mt-4 grid gap-3 md:grid-cols-2">
                                {sites.map((site) => (
                                    <label
                                        key={site.id}
                                        className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={form.siteIds.includes(
                                                site.id
                                            )}
                                            onChange={() =>
                                                toggleSite(
                                                    site.id
                                                )
                                            }
                                            className="mt-1"
                                        />

                                        <span>
                                            <span className="block text-sm font-medium text-white">
                                                {site.name}
                                            </span>

                                            <span className="block text-xs text-zinc-400">
                                                {site.code} · {site.region}
                                            </span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {error ? (
                            <p className="text-sm text-red-400">
                                {error}
                            </p>
                        ) : null}

                        {successMessage ? (
                            <p className="text-sm text-emerald-400">
                                {successMessage}
                            </p>
                        ) : null}

                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                isLoadingOptions
                            }
                            className={clsx(
                                'rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition',
                                'disabled:cursor-not-allowed disabled:opacity-70 hover:bg-zinc-200'
                            )}
                        >
                            {isSubmitting
                                ? 'Creating User...'
                                : 'Create User'}
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    )
}
