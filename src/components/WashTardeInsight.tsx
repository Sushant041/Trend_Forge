import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface WashtradeData {
  block_dates: string[];
  washtrade_assets_trend: number[];
  washtrade_suspect_sales_trend: number[];
  washtrade_volume_trend: number[];
}

interface WashtradeInsightsProps {
  data: WashtradeData | null;
}

const WashtradeInsights: React.FC<WashtradeInsightsProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<"volume" | "assets">("volume");

  if (!data) return <div>No washtrade data available</div>;

  const chartData = data.block_dates.map((date, index) => ({
    date,
    washtrade_assets: data.washtrade_assets_trend[index],
    washtrade_suspect_sales: data.washtrade_suspect_sales_trend[index],
    washtrade_volume: data.washtrade_volume_trend[index],
  }));

  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-md overflow-auto">
      <h3 className="text-xl font-semibold mb-4">Washtrade Insights</h3>
      {/* Tabs for toggling between metrics */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab("volume")}
          style={{height: "30px", padding: "4px 10px", fontSize: "13px"}}
          className={`px-4 py-2 rounded ${
            activeTab === "volume"
              ? "border-2 border-[#646cff] text-[#646cff]"
              : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
          }`}
        >
          Washtrade Volume
        </button>
        <button
        style={{height: "30px", padding: "4px 10px", fontSize: "13px"}}
          onClick={() => setActiveTab("assets")}
          className={`px-4 py-2 rounded text-xsm ${
            activeTab === "assets"
              ? "border-2 border-[#646cff] text-[#646cff]"
              : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
          }`}
        >
          Assets & Suspect Sales
        </button>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width={550} height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" reversed  />
            <YAxis />
            <Tooltip />
            <Legend />
            {activeTab === "volume" && (
              <Line
                type="monotone"
                dataKey="washtrade_volume"
                stroke="#ff7300"
                name="Washtrade Volume"
              />
            )}
            {activeTab === "assets" && (
              <>
                <Line
                  type="monotone"
                  dataKey="washtrade_assets"
                  stroke="#8884d8"
                  name="Washtrade Assets"
                />
                <Line
                  type="monotone"
                  dataKey="washtrade_suspect_sales"
                  stroke="#82ca9d"
                  name="Suspect Sales"
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WashtradeInsights;