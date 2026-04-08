import React from 'react'
import { motion } from 'framer-motion'
import { isToday, isInRange, isRangeStart, isRangeEnd, isSameDay } from '../utils/dateUtils'
import { getHoliday } from '../utils/holidays'

function DayCell({ day, startDate, endDate, effectiveEnd, onClick, onHover }) {
  const { date, isCurrentMonth } = day;
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const today = isToday(date);
  const holiday = getHoliday(date);

  // Range calculations
  const rangeStart = isRangeStart(date, startDate, effectiveEnd);
  const rangeEnd = isRangeEnd(date, startDate, effectiveEnd);
  const inRange = isInRange(date, startDate, effectiveEnd);
  const isSelected = rangeStart || rangeEnd;
  const isPreview = !endDate && effectiveEnd && (inRange || isRangeEnd(date, startDate, effectiveEnd));

  // Build the base button classes cleanly
  let cellClass = 'relative w-full h-full flex flex-col items-center justify-center rounded-md text-[11px] md:text-[13px] font-medium cursor-pointer select-none bg-transparent transition-colors duration-200';
  
  if (!isCurrentMonth) {
    cellClass += ' text-gray-400 dark:text-gray-600 cursor-default';
  } else {
    cellClass += ' text-gray-800 dark:text-white';
  }

  if (isWeekend && isCurrentMonth) {
    cellClass += ' !text-[rgba(var(--accent-rgb),0.8)]';
  }

  // Adjust borders for the connected range effect
  if (rangeStart) {
    cellClass += ' !rounded-l-md !rounded-r-none';
  }
  if (rangeEnd) {
    cellClass += ' !rounded-r-md !rounded-l-none';
  }
  if (inRange || (isPreview && !endDate)) {
    cellClass += ' !rounded-none';
  }
  if (isSameDay(startDate, effectiveEnd) && isSelected) {
    cellClass += ' !rounded-md';
  }

  // Prepare Animation Colors
  let animateBgColor = 'transparent';
  if (isSelected) {
    animateBgColor = 'rgba(var(--accent-rgb), 0.9)';
  } else if (inRange || isPreview) {
    animateBgColor = 'rgba(var(--accent-rgb), 0.10)';
  }
  
  const animateTextColor = isSelected ? '#ffffff' : undefined;

  // this will build the inner number circle classes
  let numberCircleClass = 'flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full ';
  if (today && !isSelected) {
    numberCircleClass += 'bg-[rgba(var(--accent-rgb),0.15)] text-[var(--accent)] font-bold';
  } else if (isSelected) {
    numberCircleClass += 'bg-[var(--accent)] text-white font-bold shadow-[0_2px_8px_rgba(var(--accent-rgb),0.3)]';
  }

  return (
    <motion.button
      className={cellClass}
      onClick={() => {
        if (isCurrentMonth) onClick(date);
      }}
      onMouseEnter={() => {
        if (isCurrentMonth) onHover(date);
      }}
      aria-label={`${date.toDateString()}${holiday ? ` – ${holiday.name}` : ''}`}
      tabIndex={isCurrentMonth ? 0 : -1}
      whileHover={isCurrentMonth ? { scale: 1.15, zIndex: 2 } : {}}
      whileTap={isCurrentMonth ? { scale: 0.9 } : {}}
      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
      animate={{
        backgroundColor: animateBgColor,
        color: animateTextColor,
      }}
    >
      <span className={numberCircleClass}>
        {date.getDate()}
      </span>
      
      {holiday && isCurrentMonth && (
        <motion.span 
          className={`absolute bottom-0.5 md:bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
            isSelected ? 'bg-white/80' : 'bg-[rgba(var(--accent-rgb),0.6)]'
          }`}
          title={`${holiday.emoji} ${holiday.name}`} 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ type: 'spring', stiffness: 600, delay: 0.1 }}
        />
      )}
    </motion.button>
  );
}

export default React.memo(DayCell, (prevProps, nextProps) => {
  const getTimeSafe = (d) => {
    if (d) {
      return d.getTime();
    }
    return null;
  };

  // Compare dates safely step by step
  const isDateSame = getTimeSafe(prevProps.day.date) === getTimeSafe(nextProps.day.date);
  const isStartSame = getTimeSafe(prevProps.startDate) === getTimeSafe(nextProps.startDate);
  const isEndSame = getTimeSafe(prevProps.endDate) === getTimeSafe(nextProps.endDate);
  const isEffectiveSame = getTimeSafe(prevProps.effectiveEnd) === getTimeSafe(nextProps.effectiveEnd);

  return isDateSame && isStartSame && isEndSame && isEffectiveSame;
});