export type GameMode = 'table' | 'random'
export type Screen = 'start' | 'game' | 'result'

export interface Question {
  a: number
  b: number
  ans: number
  opts: number[]
}

export interface CatInfo {
  name: string
  emoji: string
  color: string        // tailwind bg class for table button
}

export const CATS: CatInfo[] = [
  { name: 'Вася',      emoji: '🐱', color: 'from-orange-300 to-orange-400' },
  { name: 'Мурка',     emoji: '🐈', color: 'from-purple-300 to-purple-400' },
  { name: 'Пушок',     emoji: '😻', color: 'from-pink-300 to-pink-400' },
  { name: 'Лапка',     emoji: '🐈‍⬛', color: 'from-slate-400 to-slate-500' },
  { name: 'Рыжик',     emoji: '🦊', color: 'from-amber-300 to-amber-400' },
  { name: 'Снежок',    emoji: '🐇', color: 'from-sky-300 to-sky-400' },
  { name: 'Хитрец',    emoji: '😼', color: 'from-teal-300 to-teal-400' },
  { name: 'Пятнашка',  emoji: '🐆', color: 'from-yellow-300 to-yellow-400' },
  { name: 'Чернуш',    emoji: '🐺', color: 'from-indigo-400 to-indigo-500' },
  { name: 'Милашка',   emoji: '😽', color: 'from-rose-300 to-rose-400' },
]

export const CAT_MOODS = {
  happy:   '😸',
  love:    '🥰',
  normal:  '😺',
  sad:     '😿',
  angry:   '😾',
}

export const PRAISES = ['Правильно!', 'Умница!', 'Молодец!', 'Отлично!', 'Супер!', 'Точно!']
export const MISSES  = ['Не совсем...', 'Почти!', 'Попробуй ещё!', 'Не сдавайся!']

function rnd(lo: number, hi: number) {
  return lo + Math.floor(Math.random() * (hi - lo + 1))
}

export function generateQuestions(tableNum: number | 'random'): Question[] {
  const pool = Array.from({ length: 10 }, (_, i) => i + 1).sort(() => Math.random() - 0.5)
  return pool.map(n => {
    const a = tableNum === 'random' ? rnd(1, 10) : tableNum
    const b = tableNum === 'random' ? rnd(1, 10) : n
    const ans = a * b

    const spread = Math.max(4, Math.floor(ans * 0.4))
    const wrongs = new Set<number>()
    while (wrongs.size < 3) {
      const w = Math.max(1, ans + rnd(-spread, spread))
      if (w !== ans) wrongs.add(w)
    }
    const opts = [...wrongs, ans].sort(() => Math.random() - 0.5)
    return { a, b, ans, opts }
  })
}

export function starsForScore(correct: number, total: number): number {
  const pct = correct / total
  return pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : 1
}

export function loadCompleted(): number[] {
  if (typeof window === 'undefined') return []
  return JSON.parse(localStorage.getItem('kittyCatsCompleted') || '[]')
}

export function saveCompleted(completed: number[]) {
  localStorage.setItem('kittyCatsCompleted', JSON.stringify(completed))
}
