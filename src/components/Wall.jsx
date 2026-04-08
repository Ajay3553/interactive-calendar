import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { motion } from 'framer-motion'
import CalendarGrid from './CalenderGrid'
import useCalendar from '../hooks/useCalendar'
import useDateRange from '../hooks/useDateRange'
import useNotes from '../hooks/useNotes'
import { monthThemes } from '../data/monthThemes'

// Lazy load the heavy child components
const HeroPanel = React.lazy(() => import('./Hero'))
const NotesPanel = React.lazy(() => import('./NotesPanel'))

function Wall() {
  const [darkMode, setDarkMode] = useState(false)
  const cal = useCalendar()
  const range = useDateRange()
  const notes = useNotes()
  
  const theme = useMemo(() => monthThemes[cal.currentMonth], [cal.currentMonth])
  const [isNotesOpen, setIsNotesOpen] = useState(false)

  // Automatically open notes panel when a range starts
  useEffect(() => {
    if (range.startDate) {
      setIsNotesOpen(true);
    }
  }, [range.startDate])

  // Manage dark mode classes on the root document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode])

  // Inject the current month's theme colors as CSS variables
  const styleVars = {
    '--accent': theme.accent,
    '--accent-rgb': theme.accentRgb,
    '--accent-sec': theme.secondary,
  }

  return (
    <>
      {/* Force browser to decode images instantly */}
      <div style={{ display: 'none' }} aria-hidden="true">
        {monthThemes.map((t) => (
          <img
            key={t.name}
            src={t.image}
            alt="preload"
            fetchpriority="high"
            decoding="sync"
          />
        ))}
      </div>

      <motion.div
        className="relative w-full max-w-[1080px] bg-[#faf9f6] dark:bg-[#2d2c2a] rounded-[22px] shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden transition-colors duration-300"
        style={styleVars}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        {/* Top Wire Binding Strip */}
        <div className="flex justify-around items-center px-4 md:px-6 py-2 md:py-2.5 bg-gradient-to-b from-[#c8c5c0] to-[#b0aea9] dark:from-[#383633] dark:to-[#2e2d2b] border-b-2 border-black/15">
          {Array.from({ length: 18 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-3.5 h-3.5 md:w-5 md:h-5 rounded-full border-[2px] md:border-[2.5px] border-[#888] dark:border-[#555] shrink-0 shadow-inner" 
              style={{ background: 'radial-gradient(circle at 40% 35%, #e8e8e8, #aaa)' }}
            />
          ))}
        </div>

        {/* Main Two-Column Layout */}
        <div className="flex flex-col md:grid md:grid-cols-[1fr_1.25fr] min-h-[500px]">
          
          {/* Left Column: Hero Image & Notes */}
          <section className="flex flex-col border-b md:border-b-0 md:border-r border-black/10 dark:border-white/10 overflow-hidden relative">
            <Suspense fallback={<div className="h-full w-full animate-pulse bg-gray-200 dark:bg-gray-800" />}>
              <HeroPanel
                theme={theme}
                year={cal.currentYear}
                direction={cal.direction}
                isNotesOpen={isNotesOpen}
              />
              
              <NotesPanel
                isNotesOpen={isNotesOpen}
                setIsNotesOpen={setIsNotesOpen}
                startDate={range.startDate}
                endDate={range.endDate}
                currentYear={cal.currentYear}
                currentMonth={cal.currentMonth}
                saveNote={notes.saveNote}
                getNote={notes.getNote}
                getMonthNotes={notes.getMonthNotes}
                clearRange={range.clearRange}
                setRange={range.setRange}
              />
            </Suspense>
          </section>

          {/* Right Column: Calendar Grid */}
          <section className="p-4 md:p-6 md:pb-5 flex flex-col h-full">
            <CalendarGrid
              year={cal.currentYear}
              month={cal.currentMonth}
              theme={theme}
              prevMonth={cal.prevMonth}
              nextMonth={cal.nextMonth}
              direction={cal.direction}
              startDate={range.startDate}
              endDate={range.endDate}
              effectiveEnd={range.effectiveEnd}
              handleDayClick={range.handleDayClick}
              handleDayHover={range.handleDayHover}
              handleMouseLeave={range.handleMouseLeave}
            />
          </section>
          
        </div>
      </motion.div>

      {/* Floating Dark Mode Toggle */}
      <motion.button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-[#242321] text-[var(--accent)] shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-black/5 dark:border-white/10 z-50 transition-colors"
        style={styleVars}
        onClick={() => setDarkMode(d => !d)}
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
      >
        {darkMode ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </motion.button>
    </>
  )
}

export default Wall