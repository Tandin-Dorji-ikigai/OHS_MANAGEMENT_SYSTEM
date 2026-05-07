import {
    Description,
    Field,
    Input,
    Label,
} from '@headlessui/react'
import clsx from 'clsx'
import {
    useEffect,
    useState,
} from 'react'
import {
    Link,
    useLocation,
    useNavigate,
} from 'react-router-dom'

import {
    useAuth,
} from '../../hooks/useAuth'

export default function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const {
        login,
        isAuthenticated,
        loading,
    } = useAuth()
    const [email, setEmail] =
        useState('')
    const [password, setPassword] =
        useState('')
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

    async function handleSubmit(
        event
    ) {
        event.preventDefault()
        setError('')
        setIsSubmitting(true)

        try {
            await login({
                email,
                password,
            })

            navigate(
                location.state?.from
                    ?.pathname ??
                    '/dashboard',
                {
                    replace: true,
                }
            )
        } catch (submitError) {
            setError(
                submitError.response?.data
                    ?.message ??
                    'Unable to sign in with the provided credentials.'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-white">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-sm text-zinc-400">
                        Sign in to your OHS platform
                    </p>
                </div>

                <form
                    className="space-y-6"
                    autoComplete="off"
                    onSubmit={handleSubmit}
                >
                    <Field>
                        <Label className="text-sm font-medium text-white">
                            Email
                        </Label>

                        <Description className="mt-1 text-sm text-zinc-400">
                            Enter your registered email address.
                        </Description>

                        <Input
                            type="email"
                            autoComplete="off"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            className={clsx(
                                'mt-3 block w-full rounded-xl border border-white/10',
                                'bg-white/5 px-4 py-3 text-sm text-white',
                                'placeholder:text-zinc-500',
                                'focus:outline-none focus:ring-2 focus:ring-white/20'
                            )}
                            placeholder="you@example.com"
                        />
                    </Field>

                    <Field>
                        <Label className="text-sm font-medium text-white">
                            Password
                        </Label>

                        <Description className="mt-1 text-sm text-zinc-400">
                            Enter your account password.
                        </Description>

                        <Input
                            type="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            className={clsx(
                                'mt-3 block w-full rounded-xl border border-white/10',
                                'bg-white/5 px-4 py-3 text-sm text-white',
                                'placeholder:text-zinc-500',
                                'focus:outline-none focus:ring-2 focus:ring-white/20'
                            )}
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
                        disabled={isSubmitting}
                        className={clsx(
                            'w-full rounded-xl bg-white py-3',
                            'text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-70',
                            'transition hover:bg-zinc-200'
                        )}
                    >
                        {isSubmitting
                            ? 'Signing In...'
                            : 'Sign In'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-400">
                    Don&apos;t have an account?{' '}
                    <Link
                        to="/signup"
                        className="font-medium text-white hover:text-zinc-300"
                    >
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    )
}
