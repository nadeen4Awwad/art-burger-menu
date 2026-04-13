import { motion } from 'framer-motion'

const spices = [
  // Rosemary leaves (SVG paths)
  { id: 1, type: 'rosemary', x: '8%',  y: '15%', size: 28, rotation: 35,  animClass: 'float-1', opacity: 0.12 },
  { id: 2, type: 'rosemary', x: '88%', y: '28%', size: 22, rotation: -20, animClass: 'float-2', opacity: 0.09 },
  { id: 3, type: 'rosemary', x: '5%',  y: '72%', size: 32, rotation: 55,  animClass: 'float-3', opacity: 0.10 },
  { id: 4, type: 'rosemary', x: '92%', y: '65%', size: 20, rotation: -45, animClass: 'float-4', opacity: 0.08 },
  // Pepper grains
  { id: 5, type: 'pepper',   x: '18%', y: '40%', size: 6,  rotation: 0,   animClass: 'float-2', opacity: 0.14 },
  { id: 6, type: 'pepper',   x: '75%', y: '55%', size: 5,  rotation: 0,   animClass: 'float-1', opacity: 0.11 },
  { id: 7, type: 'pepper',   x: '42%', y: '80%', size: 7,  rotation: 0,   animClass: 'float-3', opacity: 0.13 },
  { id: 8, type: 'pepper',   x: '62%', y: '12%', size: 5,  rotation: 0,   animClass: 'float-5', opacity: 0.10 },
  // Salt crystals
  { id: 9,  type: 'salt',    x: '30%', y: '22%', size: 8,  rotation: 15,  animClass: 'float-4', opacity: 0.10 },
  { id: 10, type: 'salt',    x: '80%', y: '78%', size: 6,  rotation: -10, animClass: 'float-2', opacity: 0.08 },
  { id: 11, type: 'salt',    x: '55%', y: '45%', size: 9,  rotation: 30,  animClass: 'float-1', opacity: 0.07 },
]

function RosemaryIcon({ size }) {
  return (
    <svg width={size} height={size * 2.5} viewBox="0 0 20 50" fill="none">
      <line x1="10" y1="0" x2="10" y2="50" stroke="#7a9e6e" strokeWidth="1.2" strokeLinecap="round" />
      {[8, 15, 22, 29, 36, 43].map((y, i) => (
        <g key={i}>
          <line x1="10" y1={y} x2={i % 2 === 0 ? 3 : 17} y2={y + 4} stroke="#7a9e6e" strokeWidth="1" strokeLinecap="round" />
          <line x1="10" y1={y} x2={i % 2 === 0 ? 17 : 3} y2={y + 4} stroke="#7a9e6e" strokeWidth="1" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  )
}

function PepperIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <circle cx="5" cy="5" r="4" fill="#2a1a0e" stroke="#5a3a1a" strokeWidth="0.8" />
      <circle cx="3.5" cy="3.5" r="0.8" fill="#3d2510" />
    </svg>
  )
}

function SaltIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <polygon points="6,1 11,11 1,11" fill="none" stroke="rgba(220,210,200,0.6)" strokeWidth="0.8" />
      <polygon points="6,3 9.5,9.5 2.5,9.5" fill="rgba(220,210,200,0.15)" />
    </svg>
  )
}

export default function DecorativeLayer() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {spices.map((s) => (
        <div
          key={s.id}
          className={`absolute ${s.animClass}`}
          style={{
            left: s.x,
            top: s.y,
            opacity: s.opacity,
            transform: `rotate(${s.rotation}deg)`,
          }}
        >
          {s.type === 'rosemary' && <RosemaryIcon size={s.size} />}
          {s.type === 'pepper' && <PepperIcon size={s.size} />}
          {s.type === 'salt' && <SaltIcon size={s.size} />}
        </div>
      ))}
    </div>
  )
}
