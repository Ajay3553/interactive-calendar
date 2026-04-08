import { useState, useCallback } from 'react'

function useDateRange() {
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [hoverDate, setHoverDate] = useState(null)

    const handleDayClick = useCallback((date) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(date)
            setEndDate(null)
            setHoverDate(null)
        } else {
            if (date < startDate) {
                setEndDate(startDate)
                setStartDate(date)
            } else {
                setEndDate(date)
            }
            setHoverDate(null)
        }
    }, [startDate, endDate])

    const handleDayHover = useCallback((date) => {
        if (startDate && !endDate) setHoverDate(date)
    }, [startDate, endDate])

    const handleMouseLeave = useCallback(() => {
        setHoverDate(null)
    }, [])

    const clearRange = useCallback(() => {
        setStartDate(null)
        setEndDate(null)
        setHoverDate(null)
    }, [])

    const setRange = useCallback((start, end) => {
        setStartDate(start)
        setEndDate(end)
        setHoverDate(null)
    }, [])

    return {
        startDate, endDate, hoverDate, effectiveEnd: endDate || hoverDate,
        handleDayClick, handleDayHover, handleMouseLeave, clearRange,
        setRange
    }
}

export default useDateRange