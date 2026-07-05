'use client'

import { useEffect, useRef } from 'react'

interface Props {
  items: string[]
  count?: number
  trigger: number   // increment to fire
}

export default function Particles({ items, count = 10, trigger }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const prevTrigger = useRef(trigger)

  useEffect(() => {
    if (trigger === prevTrigger.current) return
    prevTrigger.current = trigger

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const el = document.createElement('div')
        el.className = 'particle select-none'
        el.textContent = items[Math.floor(Math.random() * items.length)]
        el.style.left = (8 + Math.random() * 84) + 'vw'
        el.style.top  = (20 + Math.random() * 50) + 'vh'
        document.body.appendChild(el)
        setTimeout(() => el.remove(), 950)
      }, i * 55)
    }
  }, [trigger, items, count])

  return <div ref={containerRef} />
}
