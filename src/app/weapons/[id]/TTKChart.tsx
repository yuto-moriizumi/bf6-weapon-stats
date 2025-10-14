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
  // Sort damages by distance
  const sortedDamages = [...damages].sort((a, b) => a.distance - b.distance);

  const data = [];

  // First point at distance 0
  if (sortedDamages.length > 0) {
    data.push({
      distance: 0,
      ttk: Math.round(calculateTTK(sortedDamages, 0, bulletVelocity, fireRate)),
    });
  }

  // For each damage breakpoint (except the first at distance 0), add two points at the same distance:
  // 1. Right end of previous range (using distance - 0.001 for calculation but same x coordinate)
  // 2. Left start of new range (using distance for calculation)
  for (let i = 1; i < sortedDamages.length; i++) {
    const distance = sortedDamages[i].distance;

    // Right end of previous damage range (just before breakpoint)
    data.push({
      distance: distance,
      ttk: Math.round(
        calculateTTK(sortedDamages, distance - 0.001, bulletVelocity, fireRate)
      ),
    });

    // Left start of new damage range (at breakpoint)
    data.push({
      distance: distance,
      ttk: Math.round(
        calculateTTK(sortedDamages, distance, bulletVelocity, fireRate)
      ),
    });
  }

  // Add endpoint at max distance + buffer
  const maxDistance =
    sortedDamages.length > 0
      ? Math.max(...sortedDamages.map((d) => d.distance))
      : 0;
  const endDistance = Math.max(maxDistance + 50, 100);
  data.push({
    distance: endDistance,
    ttk: Math.round(
      calculateTTK(sortedDamages, endDistance, bulletVelocity, fireRate)
    ),
  });

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
          label={{ value: "TTK (ms)", angle: -90, position: "insideLeft" }}
        />
        <Legend />
        <Line type="linear" dataKey="ttk" stroke="#ef4444" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
