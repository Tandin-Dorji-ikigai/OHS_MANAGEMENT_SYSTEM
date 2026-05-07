export default function IncidentEvidenceUpload({
    onChange,
    files = [],
    uploadProgress = {},
    attachments = [],
    disabled = false,
    helperText = 'Drag & drop files here',
}) {
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
                        {helperText}
                    </p>

                    <label
                        className="
              mt-6 inline-flex cursor-pointer rounded-xl
              bg-white px-5 py-3 text-sm font-semibold
              text-black hover:bg-zinc-200
            "
                    >
                        Choose Files

                        <input
                            type="file"
                            multiple
                            accept="image/*,video/*,.pdf"
                            onChange={onChange}
                            disabled={disabled}
                            className="hidden"
                        />
                    </label>

                    {files.length ? (
                        <div className="mt-6 space-y-2 text-left text-sm text-zinc-300">
                            {files.map((file) => (
                                <p key={file.name}>
                                    {file.name}
                                </p>
                            ))}
                        </div>
                    ) : null}

                    {Object.keys(
                        uploadProgress
                    ).length ? (
                        <div className="mt-6 space-y-2 text-left text-sm text-zinc-300">
                            {Object.entries(
                                uploadProgress
                            ).map(
                                ([
                                    name,
                                    percent,
                                ]) => (
                                    <p key={name}>
                                        {name}: {percent}%
                                    </p>
                                )
                            )}
                        </div>
                    ) : null}

                    {attachments.length ? (
                        <div className="mt-6 space-y-2 text-left text-sm text-zinc-300">
                            {attachments.map(
                                (
                                    attachment
                                ) => (
                                    <p
                                        key={
                                            attachment.id
                                        }
                                    >
                                        {
                                            attachment.originalName
                                        }
                                    </p>
                                )
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
