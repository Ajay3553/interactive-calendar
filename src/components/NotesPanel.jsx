import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatRangeLabel } from '../utils/dateUtils'

function NotesPanel({
  isNotesOpen,
  setIsNotesOpen,
  startDate,
  endDate,
  currentYear,
  currentMonth,
  saveNote,
  getNote,
  getMonthNotes,
  clearRange,
  setRange
}) {
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setText(getNote(startDate, endDate));
    setSaved(false);
  }, [startDate, endDate, getNote]);

  // Expanded, readable handleSave function
  const handleSave = () => {
    saveNote(startDate, endDate, text);
    setSaved(true);
    
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  const monthNotes = getMonthNotes(currentYear, currentMonth);
  const hasSelection = !!startDate;

  return (
      <motion.div
        className="flex flex-col bg-[#faf9f6] dark:bg-[#2d2c2a] border-t border-black/5 dark:border-white/10 absolute bottom-0 left-0 w-full"
        animate={{
          height: isNotesOpen
            ? (window.innerWidth < 768 ? '100%' : '55%') 
            : '56px'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        layout
      >
      <div
        className="flex items-center gap-2 p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors" 
        onClick={() => setIsNotesOpen(!isNotesOpen)}
      >
        <div className="text-[var(--accent)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <span className="flex-1 text-[12px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
          Notes
        </span>
        <motion.div animate={{ rotate: isNotesOpen ? 180 : 0 }} className="text-gray-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </motion.div>
        
        {startDate && isNotesOpen && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            className="px-1.5 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-gray-400 ml-2" 
            onClick={(e) => {
              e.stopPropagation();
              clearRange();
            }}
          >
            ✕
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {isNotesOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.1 }}
            className="flex-1 px-4 pb-4 overflow-y-auto"
          >
            {hasSelection ? (
              <div className="flex flex-col gap-2.5 h-full">
                <div className="text-[11px] text-[var(--accent)] font-medium bg-[rgba(var(--accent-rgb),0.08)] px-2 py-1.5 rounded-md border-l-2 border-[var(--accent)] leading-snug">
                  {formatRangeLabel(startDate, endDate) || 'Select an end date...'}
                </div>
                
                <textarea
                  className="flex-1 w-full resize-none bg-white dark:bg-[#242321] border border-black/10 dark:border-white/10 rounded-lg p-2.5 text-[13px] text-gray-800 dark:text-gray-200 focus:outline-none focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[rgba(var(--accent-rgb),0.12)] min-h-[90px] transition-shadow"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setSaved(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.ctrlKey && e.key === 'Enter') {
                      handleSave();
                    }
                  }}
                  placeholder={`write down notes for this ${endDate ? 'range' : 'date'}…`}
                />
                
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] text-gray-400">Ctrl+Enter to save</span>
                  <motion.button
                    className="text-xs font-semibold px-3.5 py-1.5 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSave}
                    disabled={!endDate}
                    whileHover={endDate ? { scale: 1.05 } : {}}
                    whileTap={endDate ? { scale: 0.95 } : {}}
                    animate={saved ? { backgroundColor: '#22a74f' } : { backgroundColor: 'var(--accent)' }}
                  >
                    {saved ? '✓ Saved' : 'Save Note'}
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-[7px]">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-px bg-black/5 dark:bg-white/5 rounded-sm"
                      style={{ width: `${85 - i * 8}%` }}
                    />
                  ))}
                </div>
                
                {monthNotes.length > 0 && (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                      This month's notes
                    </p>
                    
                    {monthNotes.map((n, i) => {
                      const sDate = new Date(n.startISO);
                      const eDate = n.endISO ? new Date(n.endISO) : null;
                      
                      return (
                        <div
                          key={i}
                          className="flex items-start gap-2 p-2 -ml-2 rounded-md cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors" 
                          onClick={() => {
                            setRange(sDate, eDate);
                            setIsNotesOpen(true);
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 mt-1" />
                          <div className="flex flex-col">
                            <span className="text-[10px] text-[var(--accent)] font-bold mb-0.5">
                              {formatRangeLabel(sDate, eDate)}
                            </span>
                            <span className="text-[12px] text-gray-600 dark:text-gray-300 leading-snug">
                              {n.text.slice(0, 45)}{n.text.length > 45 ? '…' : ''}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default React.memo(NotesPanel)