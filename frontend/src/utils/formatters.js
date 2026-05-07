export function formatLabel(value = '') {
    return String(value)
        .split(/[_\s-]+/)
        .filter(Boolean)
        .map(
            (part) =>
                part.charAt(0).toUpperCase() +
                part.slice(1).toLowerCase()
        )
        .join(' ')
}

export function formatDate(value) {
    if (!value) {
        return 'N/A'
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return value
    }

    return date.toLocaleDateString()
}
