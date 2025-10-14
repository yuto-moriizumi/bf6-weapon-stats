"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Damage = {
  id: number;
  distance: number;
  damage: number;
};

export default function DamageChart({ damages }: { damages: Damage[] }) {
  // Sort damages by distance
  const sortedDamages = [...damages].sort((a, b) => a.distance - b.distance);

  const data = sortedDamages.map((d) => ({
    distance: d.distance,
    damage: d.damage,
  }));

  // Add endpoint to ensure at least 100m is displayed
  const maxDistance =
    sortedDamages.length > 0
      ? Math.max(...sortedDamages.map((d) => d.distance))
      : 0;
  const endDistance = Math.max(maxDistance + 50, 100);
  
  // Only add endpoint if it's beyond the last data point
  if (sortedDamages.length > 0 && endDistance > maxDistance) {
    data.push({
      distance: endDistance,
      damage: sortedDamages[sortedDamages.length - 1].damage,
    });
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="distance"
          type="number"
          domain={[0, "dataMax"]}
          label={{
            value: "Distance (m)",
            position: "insideBottom",
            offset: -5,
          }}
        />
        <YAxis
          label={{ value: "Damage", angle: -90, position: "insideLeft" }}
        />
        <Tooltip />
        <Legend />
        <Line
          type="stepAfter"
          dataKey="damage"
          stroke="#3b82f6"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
