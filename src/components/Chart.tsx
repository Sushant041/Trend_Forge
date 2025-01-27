import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartProps {
  data: ({ timestamp: string} & {[key: string]: number })[];
  metric: string;
}

const Chart: React.FC<ChartProps> = ({ data, metric }) => {
  return (
    <ResponsiveContainer width={550} height={350}>
    <LineChart  data={data}>
      <CartesianGrid strokeDasharray="3 3"/>
      <XAxis dataKey="timestamp" reversed />
      <YAxis
        label={{ value: 'Volume (USD)', angle: -90, position: 'insideLeft' }}
        tickFormatter={(value) => `${(value / 1e6).toFixed(1)}M`}
        domain={[0, 'dataMax']}
      />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey={metric} stroke="#8884d8" />
    </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;