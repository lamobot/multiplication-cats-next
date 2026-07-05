'use client'

import { useState, useCallback } from 'react'
import {
  Question,
  Screen,
  CATS,
  CAT_MOODS,
  PRAISES,
  MISSES,
  generateQuestions,
  loadCompleted,
  saveCompleted,
  starsForScore,
} from '@/lib/game'

export type AnswerState = 'idle' | 'correct' | 'wrong'

export interface GameState {
  screen: Screen
  tableNum: number | 'random'
  questions: Question[]
  qi: number
  score: number
  lives: number
  streak: number
  bestStreak: number
  correct: number
  mood: number            // 0-100
  completed: number[]
  answerState: AnswerState
  chosenOpt: number | null
  lastUnlocked: number | null
  feedbackText: string
  feedbackType: 'ok' | 'bad' | null
}

function rndItem<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

function initialState(): GameState {
  return {
    screen: 'start',
    tableNum: 1,
    questions: [],
    qi: 0,
    score: 0,
    lives: 3,
    streak: 0,
    bestStreak: 0,
    correct: 0,
    mood: 50,
    completed: loadCompleted(),
    answerState: 'idle',
    chosenOpt: null,
    lastUnlocked: null,
    feedbackText: '',
    feedbackType: null,
  }
}

export function catEmoji(gs: GameState): string {
  if (gs.answerState === 'correct') return gs.streak >= 3 ? CAT_MOODS.love : CAT_MOODS.happy
  if (gs.answerState === 'wrong')   return gs.lives <= 0 ? CAT_MOODS.angry : CAT_MOODS.sad
  const m = gs.mood
  if (m >= 80) return CAT_MOODS.love
  if (m >= 55) return CAT_MOODS.happy
  if (m >= 30) return CAT_MOODS.normal
  if (m >= 10) return CAT_MOODS.sad
  return CAT_MOODS.angry
}

export function catName(gs: GameState): string {
  if (gs.tableNum === 'random') return 'Котик'
  return CATS[(gs.tableNum as number) - 1].name
}

export function starsCount(gs: GameState): number {
  return starsForScore(gs.correct, gs.questions.length)
}

export function useGame() {
  const [gs, setGs] = useState<GameState>(initialState)

  const startGame = useCallback((tableNum: number | 'random') => {
    setGs(prev => ({
      ...prev,
      screen: 'game',
      tableNum,
      questions: generateQuestions(tableNum),
      qi: 0,
      score: 0,
      lives: 3,
      streak: 0,
      bestStreak: 0,
      correct: 0,
      mood: 50,
      answerState: 'idle',
      chosenOpt: null,
      lastUnlocked: null,
    }))
  }, [])

  const goHome = useCallback(() => {
    setGs(prev => ({ ...prev, screen: 'start', lastUnlocked: null }))
  }, [])

  const pick = useCallback((chosen: number) => {
    setGs(prev => {
      if (prev.answerState !== 'idle') return prev
      const q = prev.questions[prev.qi]
      const correct = chosen === q.ans

      if (correct) {
        const newStreak = prev.streak + 1
        const bonus = newStreak >= 5 ? 20 : newStreak >= 3 ? 15 : 10
        return {
          ...prev,
          streak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
          correct: prev.correct + 1,
          score: prev.score + bonus,
          mood: Math.min(100, prev.mood + 15),
          answerState: 'correct',
          chosenOpt: chosen,
          feedbackText: rndItem(PRAISES),
          feedbackType: 'ok',
        }
      } else {
        const newLives = prev.lives - 1
        return {
          ...prev,
          streak: 0,
          lives: newLives,
          mood: Math.max(0, prev.mood - 20),
          answerState: 'wrong',
          chosenOpt: chosen,
          feedbackText: rndItem(MISSES),
          feedbackType: 'bad',
        }
      }
    })
  }, [])

  const advance = useCallback(() => {
    setGs(prev => {
      const nextQi = prev.qi + 1
      const done = nextQi >= prev.questions.length || prev.lives <= 0

      if (!done) {
        return { ...prev, qi: nextQi, answerState: 'idle', chosenOpt: null, feedbackText: '', feedbackType: null }
      }

      // compute result
      const pct = prev.correct / prev.questions.length
      const stars = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : 1
      let newCompleted = prev.completed
      let lastUnlocked: number | null = null

      if (prev.tableNum !== 'random' && stars === 3 && !prev.completed.includes(prev.tableNum as number)) {
        newCompleted = [...prev.completed, prev.tableNum as number]
        lastUnlocked = prev.tableNum as number
        saveCompleted(newCompleted)
      }

      return {
        ...prev,
        screen: 'result',
        completed: newCompleted,
        lastUnlocked,
        answerState: 'idle',
        chosenOpt: null,
      }
    })
  }, [])

  return { gs, startGame, goHome, pick, advance }
}
