'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { calculateTTK } from '@/lib/ttk'

type Damage = {
  id: number
  distance: number
  damage: number
}

type TTKChartProps = {
  damages: Damage[]
  fireRate: number
  bulletVelocity: number
}

export default function TTKChart({ damages, fireRate, bulletVelocity }: TTKChartProps) {
  // Calculate TTK for various distances
  const maxDistance = Math.max(...damages.map(d => d.distance), 100)
  const data = []
  
  // Generate data points for smooth TTK curve
  for (let distance = 0; distance <= maxDistance; distance += 5) {
    const ttk = calculateTTK(damages, distance, bulletVelocity, fireRate)
    data.push({
      distance,
      ttk: Math.round(ttk)
    })
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="distance" 
          label={{ value: 'Distance (m)', position: 'insideBottom', offset: -5 }}
        />
        <YAxis 
          label={{ value: 'TTK (ms)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip />
        <Legend />
        <Line 
          type="stepAfter" 
          dataKey="ttk" 
          stroke="#ef4444" 
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
