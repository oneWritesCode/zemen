"use client";

interface SparklineProps {
  data: number[]
  color: string
  width?: number
  height?: number
}

export function SectorSparkline({
  data,
  color,
  width = 280,
  height = 80
}: SparklineProps) {
  
  if (!data || data.length < 2) {
    return (
      <div style={{
        width, height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#444',
        fontSize: '12px',
        background: '#0d0d0d',
        borderRadius: '6px'
      }}>
        Loading chart...
      </div>
    )
  }

  const validData = data.filter(
    n => n !== null && 
    n !== undefined && 
    !isNaN(n)
  )
  
  if (validData.length < 2) return null

  const min = Math.min(...validData)
  const max = Math.max(...validData)
  const range = max - min || 1
  const padding = 8

  const points = validData.map((value, i) => {
    const x = padding + 
      (i / (validData.length - 1)) * 
      (width - padding * 2)
    const y = padding + 
      (1 - (value - min) / range) * 
      (height - padding * 2)
    return { x, y }
  })

  const pathD = points
    .map((p, i) => 
      `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
    )
    .join(' ')

  // Fill area under line
  const fillD = `${pathD} L ${points[points.length-1].x} ${height} L ${points[0].x} ${height} Z`

  const isPositive = validData[validData.length - 1] > validData[0]
  const lineColor = isPositive ? color : '#ef4444'

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`} 
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient 
          id={`grad-${color.replace('#','')}`} 
          x1="0" y1="0" x2="0" y2="1"
        >
          <stop 
            offset="0%" 
            stopColor={lineColor} 
            stopOpacity="0.3" 
          />
          <stop 
            offset="100%" 
            stopColor={lineColor} 
            stopOpacity="0" 
          />
        </linearGradient>
      </defs>
      
      {/* Fill */}
      <path 
        d={fillD} 
        fill={`url(#grad-${color.replace('#','')})`} 
      />
      
      {/* Line */}
      <path 
        d={pathD} 
        fill="none" 
        stroke={lineColor} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Last point dot */}
      <circle 
        cx={points[points.length-1].x} 
        cy={points[points.length-1].y} 
        r="3" 
        fill={lineColor} 
      />
    </svg>
  )
}

