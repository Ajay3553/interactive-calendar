import { useCallback } from 'react'

function useNotes() {
    const saveNote = useCallback((start, end, text) => {
        if (!start) return;
        const key = `note_${start.toISOString()}_${end ? end.toISOString() : ''}`;
        if (text.trim() === '') localStorage.removeItem(key);
        else localStorage.setItem(key, text);
    }, []);

    const getNote = useCallback((start, end) => {
        if (!start) return '';
        const key = `note_${start.toISOString()}_${end ? end.toISOString() : ''}`;
        return localStorage.getItem(key) || '';
    }, []);

    const getMonthNotes = useCallback((year, month) => {
        const notes = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('note_')) {
                const parts = key.split('_');
                const startISO = parts[1];
                const endISO = parts[2] || null;
                const startDate = new Date(startISO);
                if (startDate.getFullYear() === year && startDate.getMonth() === month) {
                    notes.push({ startISO, endISO, text: localStorage.getItem(key) });
                }
            }
        }
        return notes.sort((a, b) => new Date(a.startISO) - new Date(b.startISO));
    }, []);

    return { saveNote, getNote, getMonthNotes }
}
export default useNotes