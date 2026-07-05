'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  a: number   // rows
  b: number   // columns
  revealed: boolean  // answer was given
  correct: boolean   // was answer correct
}

// Pick display size based on total count
function cellSize(total: number): string {
  if (total <= 20) return 'text-2xl'
  if (total <= 42) return 'text-lg'
  if (total <= 60) return 'text-base'
  return 'text-sm'
}

export default function VisualGrid({ a, b, revealed, correct }: Props) {
  const [open, setOpen] = useState(false)
  const total = a * b

  return (
    <div className="mb-4">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="mx-auto flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-600 transition-colors font-semibold"
      >
        <span className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>▶</span>
        {open ? 'Скрыть подсказку' : 'Показать подсказку 💡'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="grid"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className={`
              bg-white/70 backdrop-blur-sm rounded-2xl border-2 p-3 text-center
              ${revealed
                ? correct ? 'border-emerald-300 bg-emerald-50/60' : 'border-pink-200 bg-pink-50/40'
                : 'border-purple-100'}
            `}>

              {/* Legend */}
              <p className="text-xs text-purple-400 mb-2 font-semibold">
                {a} ряда × {b} в каждом = <span className="text-purple-600">{total}</span>
              </p>

              {/* Grid: a rows, b cols */}
              <div className="flex flex-col items-center gap-1">
                {Array.from({ length: a }, (_, row) => (
                  <div key={row} className="flex gap-0.5 items-center">
                    {/* Row label */}
                    <span className="text-xs text-purple-300 w-4 text-right mr-1 font-mono">
                      {row + 1}
                    </span>

                    {/* Cells in this row */}
                    {Array.from({ length: b }, (_, col) => {
                      const idx = row * b + col
                      return (
                        <motion.span
                          key={col}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            delay: idx * Math.min(0.04, 1.2 / total),
                            type: 'spring',
                            stiffness: 300,
                            damping: 15,
                          }}
                          className={`${cellSize(total)} leading-none select-none`}
                        >
                          🐟
                        </motion.span>
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* Column count labels */}
              <div className="flex justify-center gap-0.5 mt-1 pl-6">
                {Array.from({ length: b }, (_, col) => (
                  <span key={col} className={`text-xs text-purple-200 font-mono ${cellSize(total) === 'text-sm' ? 'w-4' : cellSize(total) === 'text-base' ? 'w-5' : cellSize(total) === 'text-lg' ? 'w-6' : 'w-8'} text-center`}>
                    {col === Math.floor(b / 2) ? b : ''}
                  </span>
                ))}
              </div>
              {b > 1 && (
                <p className="text-xs text-purple-300 mt-0.5">↑ {b} в каждом ряду</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
