'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CATS } from '@/lib/game'

interface Props {
  completed: number[]
  onStart: (tableNum: number | 'random') => void
}

const ROTATING_CATS = ['🐱', '🐈', '😻', '🐈‍⬛', '🦊', '🐇', '😼', '🐆', '🐺', '😽']

export default function StartScreen({ completed, onStart }: Props) {
  const [heroCatIdx, setHeroCatIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setHeroCatIdx(i => (i + 1) % ROTATING_CATS.length), 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div
      key="start"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-lg mx-auto pb-10"
    >
      {/* Hero */}
      <div className="text-center py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroCatIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-9xl mb-2 cat-float inline-block"
          >
            {ROTATING_CATS[heroCatIdx]}
          </motion.div>
        </AnimatePresence>

        <h1 className="text-4xl font-bold text-purple-700 mt-4 mb-1 tracking-wide">
          Котик-Математик!
        </h1>
        <p className="text-purple-400 text-lg">
          Помоги котику собирать рыбки — реши примеры!
        </p>
      </div>

      {/* Table selection */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-3 text-center">
          Выбери таблицу умножения
        </p>
        <div className="grid grid-cols-5 gap-2.5">
          {Array.from({ length: 10 }, (_, i) => i + 1).map(t => (
            <motion.button
              key={t}
              whileHover={{ scale: 1.12, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onStart(t)}
              className={`
                relative rounded-2xl py-4 text-lg font-bold shadow-sm border-2 transition-colors
                ${completed.includes(t)
                  ? 'bg-gradient-to-b from-emerald-100 to-emerald-200 border-emerald-300 text-emerald-700'
                  : 'bg-white border-purple-200 text-purple-700 hover:border-purple-400 hover:bg-purple-50'}
              `}
            >
              ×{t}
              {completed.includes(t) && (
                <span className="absolute -top-1 -right-1 text-xs">⭐</span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Random mode */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onStart('random')}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xl font-bold shadow-md mb-6"
      >
        🎲 Случайные примеры (×1–10)
      </motion.button>

      {/* Cat collection */}
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl border-2 border-purple-100 p-5">
        <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-3">
          Мои котики ({completed.length}/{CATS.length})
        </h3>
        {completed.length === 0 ? (
          <p className="text-purple-300 text-sm text-center py-2">
            Пройди таблицу на ⭐⭐⭐ — получишь котика!
          </p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {CATS.map((cat, i) =>
              completed.includes(i + 1) ? (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center"
                >
                  <div className="text-4xl">{cat.emoji}</div>
                  <div className="text-xs text-purple-400 mt-0.5">{cat.name}</div>
                </motion.div>
              ) : (
                <div key={i} className="text-center opacity-15">
                  <div className="text-4xl grayscale">🐱</div>
                  <div className="text-xs text-gray-300 mt-0.5">×{i + 1}</div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
