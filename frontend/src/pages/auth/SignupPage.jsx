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
import {
    Link,
    useNavigate,
} from 'react-router-dom'

import {
    useAuth,
} from '../../hooks/useAuth'
import {
    getRegistrationOptions,
} from '../../services/authService'

function splitFullName(fullName) {
    const [firstName, ...rest] = fullName
        .trim()
        .split(/\s+/)
        .filter(Boolean)

    return {
        firstName: firstName ?? '',
        lastName:
            rest.join(' ') ?? '',
    }
}

const inputClassName = clsx(
    'block w-full rounded-xl border border-white/10',
    'bg-white/5 px-4 py-3 text-sm text-white',
    'placeholder:text-zinc-500',
    'focus:outline-none focus:ring-2 focus:ring-white/20'
)

export default function SignupPage() {
    const navigate = useNavigate()
    const {
        signup,
        isAuthenticated,
        loading,
    } = useAuth()
    const [fullName, setFullName] =
        useState('')
    const [email, setEmail] =
        useState('')
    const [password, setPassword] =
        useState('')
    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState('')
    const [phoneNumber, setPhoneNumber] =
        useState('')
    const [department, setDepartment] =
        useState('')
    const [teamName, setTeamName] =
        useState('')
    const [roleName, setRoleName] =
        useState('')
    const [siteId, setSiteId] =
        useState('')
    const [roles, setRoles] = useState([])
    const [sites, setSites] = useState([])
    const [
        isLoadingOptions,
        setIsLoadingOptions,
    ] = useState(true)
    const [error, setError] =
        useState('')
    const [isSubmitting, setIsSubmitting] =
        useState(false)

    useEffect(() => {
        if (
            !loading &&
            isAuthenticated
        ) {
            navigate('/dashboard', {
                replace: true,
            })
        }
    }, [
        isAuthenticated,
        loading,
        navigate,
    ])

    useEffect(() => {
        let isMounted = true

        async function loadOptions() {
            setIsLoadingOptions(true)

            try {
                const options =
                    await getRegistrationOptions()

                if (!isMounted) {
                    return
                }

                const nextRoles =
                    options?.roles ?? []
                const nextSites =
                    options?.sites ?? []

                setRoles(nextRoles)
                setSites(nextSites)
                setRoleName(
                    nextRoles[0]?.name ?? ''
                )
                setSiteId(
                    nextSites[0]?.id ?? ''
                )
                setError('')
            } catch (loadError) {
                if (isMounted) {
                    setError(
                        loadError.response?.data
                            ?.message ??
                            'Unable to load registration options.'
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

    async function handleSubmit(
        event
    ) {
        event.preventDefault()
        setError('')

        const {
            firstName,
            lastName,
        } = splitFullName(fullName)

        if (!firstName || !lastName) {
            setError(
                'Please enter your full name.'
            )
            return
        }

        if (!roleName || !siteId) {
            setError(
                'Please select your role and site.'
            )
            return
        }

        if (password !== confirmPassword) {
            setError(
                'Confirm password must match password.'
            )
            return
        }

        setIsSubmitting(true)

        try {
            await signup({
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                phoneNumber,
                department,
                teamName,
                roleName,
                siteIds: [siteId],
            })

            navigate('/dashboard', {
                replace: true,
            })
        } catch (submitError) {
            setError(
                submitError.response?.data
                    ?.message ??
                    'Unable to create your account.'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6 py-10">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-white">
                        Create account
                    </h1>

                    <p className="text-sm text-zinc-400">
                        Create your OHS management account
                    </p>
                </div>

                <form
                    className="space-y-6"
                    autoComplete="off"
                    onSubmit={handleSubmit}
                >
                    <input
                        type="text"
                        name="fakeusernameremembered"
                        autoComplete="username"
                        className="hidden"
                    />

                    <input
                        type="password"
                        name="fakepasswordremembered"
                        autoComplete="current-password"
                        className="hidden"
                    />

                    <Field>
                        <Label className="text-sm font-medium text-white">
                            Full Name
                        </Label>

                        <Input
                            type="text"
                            autoComplete="off"
                            spellCheck={false}
                            value={fullName}
                            onChange={(event) =>
                                setFullName(
                                    event.target.value
                                )
                            }
                            className={inputClassName}
                            placeholder="John Doe"
                        />
                    </Field>

                    <Field>
                        <Label className="text-sm font-medium text-white">
                            Email
                        </Label>

                        <Input
                            type="email"
                            autoComplete="off"
                            spellCheck={false}
                            autoCorrect="off"
                            autoCapitalize="off"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            className={inputClassName}
                            placeholder="you@example.com"
                        />
                    </Field>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <Field>
                            <Label className="text-sm font-medium text-white">
                                Role
                            </Label>

                            <Select
                                value={roleName}
                                onChange={(event) =>
                                    setRoleName(
                                        event.target.value
                                    )
                                }
                                disabled={
                                    isLoadingOptions
                                }
                                className={inputClassName}
                            >
                                {roles.map((role) => (
                                    <option
                                        key={role.id}
                                        value={
                                            role.name
                                        }
                                        className="bg-zinc-900"
                                    >
                                        {role.label}
                                    </option>
                                ))}
                            </Select>
                        </Field>

                        <Field>
                            <Label className="text-sm font-medium text-white">
                                Site
                            </Label>

                            <Select
                                value={siteId}
                                onChange={(event) =>
                                    setSiteId(
                                        event.target.value
                                    )
                                }
                                disabled={
                                    isLoadingOptions
                                }
                                className={inputClassName}
                            >
                                {sites.map((site) => (
                                    <option
                                        key={site.id}
                                        value={
                                            site.id
                                        }
                                        className="bg-zinc-900"
                                    >
                                        {site.name}
                                    </option>
                                ))}
                            </Select>
                        </Field>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <Field>
                            <Label className="text-sm font-medium text-white">
                                Department
                            </Label>

                            <Input
                                type="text"
                                value={department}
                                onChange={(event) =>
                                    setDepartment(
                                        event.target.value
                                    )
                                }
                                className={inputClassName}
                                placeholder="Safety"
                            />
                        </Field>

                        <Field>
                            <Label className="text-sm font-medium text-white">
                                Team
                            </Label>

                            <Input
                                type="text"
                                value={teamName}
                                onChange={(event) =>
                                    setTeamName(
                                        event.target.value
                                    )
                                }
                                className={inputClassName}
                                placeholder="Regional West"
                            />
                        </Field>
                    </div>

                    <Field>
                        <Label className="text-sm font-medium text-white">
                            Phone Number
                        </Label>

                        <Input
                            type="tel"
                            value={phoneNumber}
                            onChange={(event) =>
                                setPhoneNumber(
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
                            autoComplete="new-password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            className={inputClassName}
                            placeholder="********"
                        />
                    </Field>

                    <Field>
                        <Label className="text-sm font-medium text-white">
                            Confirm Password
                        </Label>

                        <Input
                            type="password"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(
                                    event.target.value
                                )
                            }
                            className={inputClassName}
                            placeholder="********"
                        />
                    </Field>

                    {error ? (
                        <p className="text-sm text-red-400">
                            {error}
                        </p>
                    ) : null}

                    <button
                        type="submit"
                        disabled={
                            isSubmitting ||
                            isLoadingOptions
                        }
                        className={clsx(
                            'w-full rounded-xl bg-white py-3',
                            'text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-70',
                            'transition hover:bg-zinc-200'
                        )}
                    >
                        {isSubmitting
                            ? 'Creating Account...'
                            : isLoadingOptions
                              ? 'Loading...'
                              : 'Create Account'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-400">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-medium text-white hover:text-zinc-300"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
