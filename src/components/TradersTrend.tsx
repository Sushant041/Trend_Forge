import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendData {
  block_dates: string[];
  traders_trend: number[];
  traders_buyers_trend: number[];
  traders_sellers_trend: number[];
}

interface TrendForgeChartProps {
  data: TrendData | null;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
        <p className="label" style={{ fontWeight: 'bold', marginBottom: '5px' }}>{`Time: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color, margin: '3px 0' }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const TradersTrend: React.FC<TrendForgeChartProps> = ({ data }) => {
  // Transform the data into the format required by Recharts
  const chartData = data?.block_dates.map((date, index) => ({
    timestamp: date,
    traders: data?.traders_trend[index],
    buyers: data?.traders_buyers_trend[index],
    sellers: data?.traders_sellers_trend[index],
  }));

  return (
    <ResponsiveContainer width={550} height={350}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis
          dataKey="timestamp"
          // reversed
          // tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
          interval={Math.ceil(chartData?.length / 4)}
          // tick={{ fill: '#555' }}
          // axisLine={{ stroke: '#ccc' }}
        />
        <YAxis
          label={{ value: 'Count', angle: -90, position: 'insideLeft', fill: '#555' }}
          domain={[0, 'dataMax']}
          tick={{ fill: '#555' }}
          axisLine={{ stroke: '#ccc' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: '10px' }} />
        <Line
          type="monotone"
          dataKey="traders"
          name="Traders"
          stroke="#6366f1" // Vibrant indigo
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 8 }}
          animationDuration={500}
        />
        <Line
          type="monotone"
          dataKey="buyers"
          name="Buyers"
          stroke="#10b981" // Vibrant green
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 8 }}
          animationDuration={500}
        />
        <Line
          type="monotone"
          dataKey="sellers"
          name="Sellers"
          stroke="#ef4444" // Vibrant red
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 8 }}
          animationDuration={500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TradersTrend;