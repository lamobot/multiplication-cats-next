'use client'

import { AnimatePresence } from 'framer-motion'
import { useCallback } from 'react'
import { useGame } from '@/hooks/useGame'
import Background from '@/components/Background'
import StartScreen from '@/components/StartScreen'
import GameScreen from '@/components/GameScreen'
import ResultScreen from '@/components/ResultScreen'

export default function Home() {
  const { gs, startGame, goHome, pick, advance } = useGame()

  const handleRetry = useCallback(() => {
    startGame(gs.tableNum)
  }, [startGame, gs.tableNum])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <Background />

      <AnimatePresence mode="wait">
        {gs.screen === 'start' && (
          <StartScreen
            key="start"
            completed={gs.completed}
            onStart={startGame}
          />
        )}
        {gs.screen === 'game' && (
          <GameScreen
            key="game"
            gs={gs}
            onPick={pick}
            onAdvance={advance}
            onHome={goHome}
          />
        )}
        {gs.screen === 'result' && (
          <ResultScreen
            key="result"
            gs={gs}
            onRetry={handleRetry}
            onHome={goHome}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
