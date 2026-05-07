export default function IncidentEvidenceUpload() {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">

            <div className="mb-8">
                <h2 className="text-2xl font-bold">
                    Incident Evidence
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                    Upload photos, videos, and documents
                </p>
            </div>

            <div
                className="
          flex min-h-[220px] items-center justify-center
          rounded-2xl border border-dashed border-white/10
          bg-white/[0.02]
        "
            >
                <div className="text-center">

                    <p className="text-lg font-medium">
                        Upload Incident Evidence
                    </p>

                    <p className="mt-2 text-sm text-zinc-400">
                        Drag & drop files here
                    </p>

                    <button
                        type="button"
                        className="
              mt-6 rounded-xl bg-white px-5 py-3
              text-sm font-semibold text-black
              hover:bg-zinc-200
            "
                    >
                        Choose Files
                    </button>
                </div>
            </div>
        </div>
    )
}