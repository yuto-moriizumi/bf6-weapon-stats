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
import { calculateTTK } from "@/lib/ttk";

type Damage = {
  id: number;
  distance: number;
  damage: number;
};

type TTKChartProps = {
  damages: Damage[];
  fireRate: number;
  bulletVelocity: number;
};

export default function TTKChart({
  damages,
  fireRate,
  bulletVelocity,
}: TTKChartProps) {
  const sortedDamages = [...damages].sort((a, b) => a.distance - b.distance);

  const data = [];

  for (let distance = 0; distance <= 100; distance++) {
    data.push({
      distance,
      ttk: Math.round(
        calculateTTK(sortedDamages, distance, bulletVelocity, fireRate)
      ),
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
          label={{ value: "TTK (ms)", angle: -90, position: "insideLeft" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "0.375rem",
            color: "#f3f4f6",
          }}
          labelStyle={{ color: "#f3f4f6" }}
        />
        <Legend />
        <Line type="linear" dataKey="ttk" stroke="#ef4444" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
