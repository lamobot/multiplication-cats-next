'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameState, catEmoji, catName } from '@/hooks/useGame'
import Particles from './Particles'
import VisualGrid from './VisualGrid'

interface Props {
  gs: GameState
  onPick: (opt: number) => void
  onAdvance: () => void
  onHome: () => void
}

const OK_PARTICLES  = ['🐟', '⭐', '💫', '✨', '🌟']
const BAD_PARTICLES = ['😿', '💦', '❄️']

function playTone(freq: number, vol = 0.08, type: OscillatorType = 'sine') {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.22)
  } catch {}
}

export default function GameScreen({ gs, onPick, onAdvance, onHome }: Props) {
  const q = gs.questions[gs.qi]

  // Derive animation class directly from answerState — no local state needed
  const catAnim =
    gs.answerState === 'correct' ? 'cat-jump' :
    gs.answerState === 'wrong'   ? 'cat-wiggle' : ''

  // Use gs.correct as okTrigger (increments on every correct answer)
  // Use 3 - gs.lives as badTrigger (increments on every mistake)
  const okTrigger  = gs.correct
  const badTrigger = 3 - gs.lives

  // Audio & advance timer — only side effects go in useEffect
  const prevAnswer = useRef<string>('idle')
  const advanceRef = useRef(onAdvance)
  // keep ref current via effect so we don't update it during render
  useEffect(() => { advanceRef.current = onAdvance })

  useEffect(() => {
    if (gs.answerState === prevAnswer.current || gs.answerState === 'idle') {
      prevAnswer.current = gs.answerState
      return
    }
    prevAnswer.current = gs.answerState

    if (gs.answerState === 'correct') {
      playTone(880)
      const t1 = setTimeout(() => playTone(1100), 90)
      const t2 = setTimeout(() => advanceRef.current(), 1100)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    } else if (gs.answerState === 'wrong') {
      playTone(200, 0.1, 'sawtooth')
      const t = setTimeout(() => advanceRef.current(), 1400)
      return () => clearTimeout(t)
    }
  }, [gs.answerState])

  const moodPct = gs.mood
  const moodColor =
    moodPct >= 75 ? '#06d6a0' :
    moodPct >= 45 ? '#ffd166' :
    moodPct >= 20 ? '#ff9f5b' : '#ff6b9d'

  return (
    <motion.div
      key="game"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-lg mx-auto"
    >
      <Particles items={OK_PARTICLES}  count={10} trigger={okTrigger} />
      <Particles items={BAD_PARTICLES} count={4}  trigger={badTrigger} />

      {/* Top bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-2xl tracking-widest">
          {'❤️'.repeat(gs.lives)}{'🖤'.repeat(3 - gs.lives)}
        </div>
        <div className="bg-white/80 rounded-full px-4 py-1.5 font-bold text-purple-700 border border-purple-200 text-sm">
          ⭐ {gs.score}
        </div>
        <div className="min-w-[60px] text-right">
          {gs.streak >= 3 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-orange-100 text-orange-600 rounded-full px-3 py-1 font-bold text-sm"
            >
              🔥 {gs.streak}
            </motion.span>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="h-2 bg-purple-100 rounded-full mb-3 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-500"
          animate={{ width: `${(gs.qi / gs.questions.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Mood meter */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-purple-300 font-semibold whitespace-nowrap">Настроение</span>
        <div className="flex-1 h-3 bg-purple-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: moodColor }}
            animate={{ width: `${moodPct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-xl">{catEmoji(gs)}</span>
      </div>

      {/* Cat character — no remount, just CSS animation classes */}
      <div className="text-center mb-1 h-24 flex flex-col items-center justify-center">
        <span className={`text-8xl leading-none inline-block ${catAnim}`}>
          {catEmoji(gs)}
        </span>
        <span className="text-xs text-purple-300 mt-1">{catName(gs)}</span>
      </div>

      {/* Feedback */}
      <div className="h-9 flex items-center justify-center mb-2">
        <AnimatePresence mode="wait">
          {gs.feedbackType && gs.feedbackText && (
            <motion.span
              key={`${gs.qi}-${gs.answerState}`}
              initial={{ opacity: 0, y: -8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              className={`text-xl font-bold ${gs.feedbackType === 'ok' ? 'text-emerald-500' : 'text-pink-500'}`}
            >
              {gs.feedbackText}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={gs.qi}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-blue-200 px-6 py-7 text-center mb-5 shadow-sm"
        >
          <span className="block text-xs text-blue-300 font-semibold mb-1 uppercase tracking-widest">
            {gs.tableNum !== 'random'
              ? `Таблица ×${gs.tableNum} · вопрос ${gs.qi + 1}/${gs.questions.length}`
              : `Случайный · ${gs.qi + 1}/${gs.questions.length}`}
          </span>
          <span className="text-4xl font-bold text-slate-700 tracking-wider">
            {q.a} × {q.b} = ?
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Visual hint grid */}
      <VisualGrid
        a={q.a}
        b={q.b}
        revealed={gs.answerState !== 'idle'}
        correct={gs.answerState === 'correct'}
      />

      {/* Answer buttons — no entrance animation, just hover/tap */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {q.opts.map(opt => {
          const isChosen  = gs.chosenOpt === opt
          const isCorrect = opt === q.ans
          const revealed  = gs.answerState !== 'idle'

          let btnClass = 'bg-white border-2 border-purple-200 text-slate-700 hover:border-purple-400 hover:bg-purple-50'
          if (revealed && isCorrect) {
            btnClass = 'bg-emerald-100 border-2 border-emerald-400 text-emerald-700'
          } else if (revealed && isChosen && !isCorrect) {
            btnClass = 'bg-pink-100 border-2 border-pink-400 text-pink-700'
          }

          return (
            <motion.button
              key={opt}
              whileHover={!revealed ? { scale: 1.04, y: -2 } : {}}
              whileTap={!revealed ? { scale: 0.96 } : {}}
              disabled={revealed}
              onClick={() => onPick(opt)}
              className={`${btnClass} rounded-2xl py-5 text-3xl font-bold transition-colors duration-200 shadow-sm`}
            >
              {opt}
            </motion.button>
          )
        })}
      </div>

      <button
        onClick={onHome}
        className="block mx-auto text-sm text-purple-300 hover:text-purple-500 underline transition-colors"
      >
        ← в меню
      </button>
    </motion.div>
  )
}
