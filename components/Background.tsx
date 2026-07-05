export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Soft gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50" />

      {/* Decorative blobs */}
      <div className="bg-blob absolute -top-32 -left-32 w-96 h-96 rounded-full bg-purple-200/40 blur-3xl" />
      <div className="bg-blob absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-pink-200/40 blur-3xl" style={{ animationDelay: '2s' }} />
      <div className="bg-blob absolute -bottom-24 left-1/4 w-72 h-72 rounded-full bg-orange-200/30 blur-3xl" style={{ animationDelay: '4s' }} />

      {/* Floating paw prints */}
      {['top-12 left-10', 'top-24 right-16', 'bottom-20 left-8', 'bottom-32 right-12', 'top-1/2 left-4', 'top-2/3 right-6'].map((pos, i) => (
        <span
          key={i}
          className={`absolute ${pos} text-purple-200 select-none`}
          style={{ fontSize: `${1.2 + (i % 3) * 0.4}rem`, animationDelay: `${i * 0.8}s` }}
        >
          🐾
        </span>
      ))}
    </div>
  )
}
