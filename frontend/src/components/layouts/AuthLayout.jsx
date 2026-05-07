export default function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-8 shadow-2xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>
                </div>

                {children}
            </div>
        </div>
    )
}