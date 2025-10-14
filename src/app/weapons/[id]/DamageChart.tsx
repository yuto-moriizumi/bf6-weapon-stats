"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Damage = {
  id: number;
  distance: number;
  damage: number;
};

export default function DamageChart({ damages }: { damages: Damage[] }) {
  const sortedDamages = [...damages].sort((a, b) => a.distance - b.distance);
  const data = sortedDamages.map((d) => ({
    distance: d.distance,
    damage: d.damage,
  }));

  if (
    sortedDamages.length > 0 &&
    sortedDamages[sortedDamages.length - 1].distance < 100
  ) {
    data.push({
      distance: 100,
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
          domain={[0, 100]}
          label={{
            value: "Distance (m)",
            position: "insideBottom",
            offset: -5,
          }}
        />
        <YAxis
          label={{ value: "Damage", angle: -90, position: "insideLeft" }}
        />
        <Legend />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "0.375rem",
            color: "#f3f4f6",
          }}
          labelStyle={{ color: "#f3f4f6" }}
        />
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
