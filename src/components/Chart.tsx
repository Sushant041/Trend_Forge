import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ChartProps {
  data: ({ timestamp: string} & {[key: string]: number })[];
  metric: string;
}

const Chart: React.FC<ChartProps> = ({ data, metric }) => {
  return (
    <LineChart width={800} height={400} data={data}>
      <CartesianGrid strokeDasharray="8 3"/>
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
  );
};

export default Chart;