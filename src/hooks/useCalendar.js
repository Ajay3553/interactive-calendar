import { useState, useCallback } from 'react'

function useCalendar() {
    const today = new Date();
    
    const [calState, setCalState] = useState({
        month: today.getMonth(),
        year: today.getFullYear()
    });
    
    const [direction, setDirection] = useState('next');

    const prevMonth = useCallback(() => {
        setDirection('prev');
        
        setCalState((prev) => {
            if (prev.month === 0) {
                return {
                    month: 11,
                    year: prev.year - 1
                };
            }
            return {
                month: prev.month - 1,
                year: prev.year
            };
        });
    }, []);

    const nextMonth = useCallback(() => {
        setDirection('next');
        
        setCalState((prev) => {
            if (prev.month === 11) {
                return {
                    month: 0,
                    year: prev.year + 1
                };
            }
            return {
                month: prev.month + 1,
                year: prev.year
            };
        });
    }, []);

    return {
        currentMonth: calState.month,
        currentYear: calState.year,
        prevMonth,
        nextMonth,
        direction
    };
}

export default useCalendar