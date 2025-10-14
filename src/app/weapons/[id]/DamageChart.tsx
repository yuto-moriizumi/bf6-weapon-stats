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
  const data = damages.map((d) => ({
    distance: d.distance,
    damage: d.damage,
  }));

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
