import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Animation Variants
const heroVariants = {
  enter: (dir) => ({
    opacity: 0,
    y: dir === 'next' ? -40 : 40
  }),
  center: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: (dir) => ({
    opacity: 0,
    y: dir === 'next' ? 40 : -40,
    transition: {
      duration: 0.2
    }
  })
};

// Component
function Hero({ theme, year, direction, isNotesOpen }) {
  return (
    <motion.div
      className="shrink-0 overflow-hidden relative w-full"
      animate={{ height: isNotesOpen ? '45%' : 'calc(100% - 56px)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      layout
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={theme.name + year}
          custom={direction}
          variants={heroVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image */}
          <motion.img
            src={theme.image}
            alt={theme.name}
            className="w-full h-full object-cover"
            decoding="async"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          
          {/* Diagonal Gradient Overlay & Typography */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent from-45% md:from-55% to-[rgba(var(--accent-rgb),0.65)] to-45% md:to-55% flex flex-col justify-end items-end p-4 pointer-events-none">
            
            <div className="flex flex-col items-end gap-[1px]">
              <span className="font-serif text-[15px] text-white/90 leading-none">
                {year}
              </span>
              
              <span className="font-serif text-[22px] font-bold text-white leading-none tracking-wider">
                {theme.name.toUpperCase()}
              </span>
            </div>
            
            <span className="text-[10px] tracking-widest uppercase text-white/75 mt-1">
              {theme.label}
            </span>
            
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export default React.memo(Hero);