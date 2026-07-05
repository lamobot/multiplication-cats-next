'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CATS } from '@/lib/game'
import { GameState, starsCount } from '@/hooks/useGame'
import Particles from './Particles'

interface Props {
  gs: GameState
  onRetry: () => void
  onHome: () => void
}

export default function ResultScreen({ gs, onRetry, onHome }: Props) {
  const stars = starsCount(gs)
  const total = gs.questions.length
  // use lastUnlocked as trigger: non-zero when a cat was just unlocked
  const celebrateTrigger = gs.lastUnlocked ?? 0

  const unlockedCat = gs.lastUnlocked ? CATS[gs.lastUnlocked - 1] : null

  const titleMap: Record<number, string> = { 3: 'Блестяще!', 2: 'Хорошо!', 1: 'Не сдавайся!' }
  const subtitleMap: Record<number, string> = {
    3: 'Ты настоящий математик!',
    2: 'Ещё немного тренировки!',
    1: 'Продолжай — всё получится!',
  }

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 180 }}
      className="w-full max-w-md mx-auto"
    >
      {gs.lastUnlocked && (
        <Particles items={['🎉', '⭐', '🐟', '✨', '🎊', '🌟']} count={22} trigger={celebrateTrigger} />
      )}

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-amber-200 shadow-md p-8 text-center">
        {/* Title */}
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-slate-700 mb-1"
        >
          {titleMap[stars]}
        </motion.h2>
        <p className="text-purple-400 mb-5">{subtitleMap[stars]}</p>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map(i => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: i <= stars ? 1 : 0.7, rotate: 0, opacity: i <= stars ? 1 : 0.25 }}
              transition={{ delay: 0.2 + i * 0.12, type: 'spring', stiffness: 200 }}
              className="text-5xl"
            >
              ⭐
            </motion.span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { val: gs.score,                label: 'очков' },
            { val: `${gs.correct}/${total}`, label: 'правильно' },
            { val: gs.bestStreak,            label: 'серия' },
          ].map(({ val, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="bg-purple-50 rounded-2xl py-3 px-2"
            >
              <div className="text-2xl font-bold text-pink-500">{val}</div>
              <div className="text-xs text-purple-300 mt-0.5">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Unlocked cat banner */}
        <AnimatePresence>
          {unlockedCat && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 150 }}
              className="bg-amber-50 border-2 border-amber-200 rounded-2xl py-5 px-4 mb-6"
            >
              <p className="text-amber-600 font-semibold text-sm mb-2">Новый котик разблокирован!</p>
              <div className="cat-float inline-block text-7xl">{unlockedCat.emoji}</div>
              <p className="text-lg font-bold text-amber-700 mt-1">{unlockedCat.name}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={onRetry}
            className="bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-2xl px-7 py-3.5 font-bold text-lg shadow-sm"
          >
            🔄 Ещё раз!
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={onHome}
            className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-2xl px-7 py-3.5 font-bold text-lg shadow-sm"
          >
            🏠 Меню
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
