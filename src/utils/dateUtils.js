export function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfWeek(year, month) {
    const day = new Date(year, month, 1).getDay()
    return day === 0 ? 6 : day - 1
}

export function isToday(date) {
    return isSameDay(date, new Date())
}

export function isSameDay(d1, d2) {
    if (!d1 || !d2) return false
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}

export function isInRange(date, start, end) {
    if (!start || !end || !date) return false
    const d = date.getTime()
    const [lo, hi] = start <= end ? [start.getTime(), end.getTime()] : [end.getTime(), start.getTime()]
    return d > lo && d < hi
}

export function isRangeStart(date, start, end) {
    if (!start) return false
    if (end && start > end) return isSameDay(date, end)
    return isSameDay(date, start)
}

export function isRangeEnd(date, start, end) {
    if (!end) return false
    if (start && start > end) return isSameDay(date, start)
    return isSameDay(date, end)
}

export function formatDate(date) {
    if (!date) return ''
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatRangeKey(start, end) {
    if (!start) return ''
    const s = start.toISOString().split('T')[0]
    if (!end) return s
    const [lo, hi] = start <= end ? [start, end] : [end, start]
    return `${lo.toISOString().split('T')[0]}_${hi.toISOString().split('T')[0]}`
}

export function formatRangeLabel(start, end) {
    if (!start) return ''
    if (!end || isSameDay(start, end)) return formatDate(start)
    const [lo, hi] = start <= end ? [start, end] : [end, start]
    const days = Math.round((hi - lo) / 86400000) + 1
    return `${formatDate(lo)} → ${formatDate(hi)}  (${days} day${days > 1 ? 's' : ''})`
}

export function buildCalendarDays(year, month) {
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfWeek(year, month)
    const days = []

    const prevM = month === 0 ? 11 : month - 1
    const prevY = month === 0 ? year - 1 : year
    const prevTotal = getDaysInMonth(prevY, prevM)
    for (let i = firstDay - 1; i >= 0; i--) {
        days.push({ date: new Date(prevY, prevM, prevTotal - i), isCurrentMonth: false })
    }

    for (let d = 1; d <= daysInMonth; d++) {
        days.push({ date: new Date(year, month, d), isCurrentMonth: true })
    }

    const nextM = month === 11 ? 0 : month + 1
    const nextY = month === 11 ? year + 1 : year
    const remaining = 42 - days.length
    for (let d = 1; d <= remaining; d++) {
        days.push({ date: new Date(nextY, nextM, d), isCurrentMonth: false })
    }

    return days
}
