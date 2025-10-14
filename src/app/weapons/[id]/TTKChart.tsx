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
  // Sort damages by distance
  const sortedDamages = [...damages].sort((a, b) => a.distance - b.distance)
  
  // Generate data points only at damage breakpoint edges
  // TTK is linear within each damage range, so we only need edge points
  const data = []
  
  // Add point at each damage breakpoint (including distance 0)
  for (let i = 0; i < sortedDamages.length; i++) {
    const distance = sortedDamages[i].distance
    data.push({
      distance: distance,
      ttk: Math.round(calculateTTK(sortedDamages, distance, bulletVelocity, fireRate))
    })
  }
  
  // Add endpoint at max distance + buffer to show the extended line
  const maxDistance = sortedDamages.length > 0 
    ? Math.max(...sortedDamages.map(d => d.distance))
    : 0
  const endDistance = Math.max(maxDistance + 50, 100)
  data.push({
    distance: endDistance,
    ttk: Math.round(calculateTTK(sortedDamages, endDistance, bulletVelocity, fireRate))
  })

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
