import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { buildCalendarDays } from '../utils/dateUtils'
import DayCell from './DayCell'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Animation Variants
const gridVariants = {
  enter: (dir) => ({
    opacity: 0,
    x: dir === 'next' ? 90 : -90,
    rotateX: dir === 'next' ? 12 : -12,
    scale: 0.96
  }),
  center: {
    opacity: 1,
    x: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 28,
      staggerChildren: 0.013,
      delayChildren: 0.06
    }
  },
  exit: (dir) => ({
    opacity: 0,
    x: dir === 'next' ? -90 : 90,
    rotateX: dir === 'next' ? -12 : 12,
    scale: 0.96,
    transition: {
      duration: 0.22,
      ease: [0.7, 0, 1, 0.4]
    }
  })
};

const cellVariants = {
  enter: { opacity: 0, scale: 0.6, y: 10 },
  center: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 500, damping: 26 }
  }
};

const titleVariants = {
  enter: (dir) => ({
    opacity: 0,
    y: dir === 'next' ? 28 : -28,
    filter: 'blur(6px)'
  }),
  center: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 420, damping: 30 }
  },
  exit: (dir) => ({
    opacity: 0,
    y: dir === 'next' ? -28 : 28,
    filter: 'blur(6px)',
    transition: { duration: 0.18, ease: 'easeIn' }
  })
};

const weekdayRowVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
};

const weekdayItemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 600, damping: 28 }
  }
};

const hintVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22 } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } }
};

// Component
function CalendarGrid({
  year,
  month,
  theme,
  prevMonth,
  nextMonth,
  direction,
  startDate,
  endDate,
  effectiveEnd,
  handleDayClick,
  handleDayHover,
  handleMouseLeave
}) {
  const days = useMemo(() => buildCalendarDays(year, month), [year, month]);
  
  
  let hintKey = 'idle';
  if (startDate && !endDate) {
    hintKey = 'picking';
  } else if (startDate && endDate) {
    hintKey = 'done';
  }

  const hintMessages = {
    idle: 'Click a date to start selecting a range',
    picking: 'Now click an end date to complete the range',
    done: '✓ Range selected — add notes in the panel ↓'
  };

  const hintText = hintMessages[hintKey];

  return (
    <div className="flex flex-col gap-3 h-full">
      
      {/* Top Image Banner */}
      <motion.div
        layout
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-20 md:h-24 w-full overflow-hidden rounded-2xl border border-black/5 dark:border-white/10 shadow-sm bg-gray-100 dark:bg-gray-800"
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={theme.name}
            custom={direction}
            variants={titleVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={theme.image}
              alt={theme.name}
              className="h-full w-full object-cover"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-[rgba(var(--accent-rgb),0.55)] pointer-events-none" />
            
            <div className="absolute left-3 bottom-3 text-white pointer-events-none">
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold opacity-90 drop-shadow-md">
                {theme.label}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-1">
        
        {/* Previous Button */}
        <motion.button
          className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300 bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 shadow-sm hover:dark:bg-white/20 transition-colors"
          onClick={prevMonth}
          whileHover={{
            scale: 1.08,
            x: -3,
            backgroundColor: 'var(--accent)',
            color: '#fff',
            borderColor: 'var(--accent)'
          }}
          whileTap={{ scale: 0.9 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </motion.button>

        {/* Month & Year Title */}
        <div className="relative min-w-[140px] h-[52px] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div 
              key={`title-${year}-${month}`}
              className="absolute flex flex-col items-center"
              custom={direction}
              variants={titleVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <span className="font-serif text-[18px] md:text-[20px] font-bold text-gray-900 dark:text-gray-100 leading-none">
                {theme.name}
              </span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                {year}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next Button */}
        <motion.button
          className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300 bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 shadow-sm hover:dark:bg-white/20 transition-colors"
          onClick={nextMonth}
          whileHover={{
            scale: 1.08,
            x: 3,
            backgroundColor: 'var(--accent)',
            color: '#fff',
            borderColor: 'var(--accent)'
          }}
          whileTap={{ scale: 0.9 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </motion.button>
      </div>

      {/* Weekday Headers */}
      <motion.div
        className="grid grid-cols-7 text-center mt-1"
        variants={weekdayRowVariants}
        initial="hidden"
        animate="visible"
      >
        {WEEKDAYS.map((dayName) => {
          const isWeekend = dayName === 'Sat' || dayName === 'Sun';
          const textColor = isWeekend
            ? 'text-[rgba(var(--accent-rgb),0.8)]'
            : 'text-gray-400 dark:text-gray-500';

          return (
            <motion.div
              key={dayName}
              variants={weekdayItemVariants}
              className={`text-[10px] md:text-[11px] font-semibold uppercase tracking-wider py-1 ${textColor}`}
            >
              {dayName}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Days Grid */}
      <div className="perspective-900">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`grid-${year}-${month}`}
            custom={direction}
            variants={gridVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="grid grid-cols-7 gap-[6px] md:gap-[8px] preserve-3d"
            onMouseLeave={handleMouseLeave}
          >
            {days.map((day, i) => (
              <motion.div
                key={`${day.date.toISOString()}-${i}`}
                variants={cellVariants}
                className="aspect-square rounded-md overflow-visible"
                layout
              >
                <DayCell
                  day={day}
                  startDate={startDate}
                  endDate={endDate}
                  effectiveEnd={effectiveEnd}
                  onClick={handleDayClick}
                  onHover={handleDayHover}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Hint Text */}
      <div className="relative h-5 overflow-hidden mt-1">
        <AnimatePresence mode="wait">
          <motion.p
            key={hintKey}
            variants={hintVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`absolute inset-0 flex items-center justify-center text-center text-[11px] ${
              hintKey === 'done' ? 'text-[var(--accent)] font-medium' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {hintText}
          </motion.p>
        </AnimatePresence>
      </div>
      
    </div>
  )
}

export default React.memo(CalendarGrid)