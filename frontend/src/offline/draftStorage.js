const DRAFT_PREFIX = 'ohs_draft_'

export function saveDraft(
    key,
    data
) {
    localStorage.setItem(
        `${DRAFT_PREFIX}${key}`,
        JSON.stringify({
            data,
            updatedAt: new Date(),
        })
    )
}

export function loadDraft(key) {
    const draft =
        localStorage.getItem(
            `${DRAFT_PREFIX}${key}`
        )

    if (!draft) return null

    return JSON.parse(draft)
}

export function removeDraft(key) {
    localStorage.removeItem(
        `${DRAFT_PREFIX}${key}`
    )
}