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

type Loadout = {
  id: number;
  name: string;
  bulletVelocity: number;
};

type TTKChartProps = {
  damages: Damage[];
  fireRate: number;
  loadouts: Loadout[];
};

const COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

export default function TTKChart({
  damages,
  fireRate,
  loadouts,
}: TTKChartProps) {
  const sortedDamages = [...damages].sort((a, b) => a.distance - b.distance);

  const groupedLoadouts = loadouts.reduce(
    (acc, loadout) => {
      const key = loadout.bulletVelocity;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(loadout);
      return acc;
    },
    {} as Record<number, Loadout[]>,
  );

  const representativeLoadouts = Object.values(groupedLoadouts).map((group) => {
    const names = group.map((l) => l.name).join(", ");
    return {
      ...group[0],
      name: names,
    };
  });

  const data = [];

  for (let distance = 0; distance <= 100; distance++) {
    const dataPoint: Record<string, number> = { distance };

    representativeLoadouts.forEach((loadout) => {
      dataPoint[loadout.name] = Math.round(
        calculateTTK(sortedDamages, distance, loadout.bulletVelocity, fireRate),
      );
    });

    data.push(dataPoint);
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
        {representativeLoadouts.map((loadout, index) => (
          <Line
            key={loadout.id}
            type="linear"
            dataKey={loadout.name}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
