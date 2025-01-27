import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "./components/Chart";
import Predictor from "./components/Predictor";
import { format } from "date-fns";
import MetricSelect from "./components/MetricSelct.tsx";
import ChainSelect from "./components/chainSelect.tsx";
import { metricsData } from "./data/DataLists.ts";
import NftList from "./components/NftList";
import { SelectTimerange } from "./components/SelectTimerange.tsx";
import WalletAnalytics from "./components/WalletAnalytics.tsx";

interface Blockchain {
  metadata: {
    currency_id: string;
    description: string;
    id: number;
    latest_data_timestamp: string;
    name: string;
    thumbnail_url: string;
  };
}

const App: React.FC = () => {
  const [data, setData] = useState<({ timestamp: string } & { [key: string]: number })[]>([]);
  const [metric, setMetric] = useState<string>("volume");
  const [blockchain, setBlockchain] = useState<number | string>(1); // Default: Ethereum
  const [optionBlockchain, setOptionBlockchain] = useState<Blockchain[]>([
    {
      metadata: {
        currency_id: "",
        description: "",
        id: 1,
        latest_data_timestamp: "",
        name: "Ethereum",
        thumbnail_url: "",
      },
    },
  ]);
  const [timeRange, setTimeRange] = useState<string>("90d"); // Default time range
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"trends" | "nft-list" | "wallet-analytics">("trends"); // Tracks active tab

  // Fetch supported blockchains
  const getSupportedBlockchains = async () => {
    try {
      const response = await axios.get("https://api.unleashnfts.com/api/v1/blockchains", {
        params: {
          sort_by: "blockchain_name",
          offset: 0,
          limit: 30,
          "x-api-key": "cbe32ab2a4ce0186852a6a5299b214fd",
        },
        headers: {
          Authorization: "cbe32ab2a4ce0186852a6a5299b214fd", // Replace with your API key
        },
      });

      setOptionBlockchain(response.data.blockchains);
    } catch (error) {
      console.error("Error fetching blockchains:", error);
    }
  };

  // Fetch market trend data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://api.unleashnfts.com/api/v1/market/trend", {
        params: {
          currency: "usd",
          blockchain: blockchain,
          metrics: metric,
          time_range: timeRange,
          include_washtrade: "true",
          "x-api-key": "df51d1d20cd88215009bea3b1861cf4d",
        },
        headers: {
          Authorization: "df51d1d20cd88215009bea3b1861cf4d", // Replace with your API key
        },
      });

      const validData = response.data.data_points
        .filter(
          (item: { values: { [key: string]: string | number } }) =>
            item.values[metric] !== "NA"
        )
        .map((item: { date: string; values: { [key: string]: number } }) => ({
          timestamp: format(new Date(item.date), "MMM dd, yyyy HH:mm"), // Format the date
          [metric]: item.values[metric], // Extract metric data
        }));

      setData(validData);
    } catch (error) {
      console.error("Error fetching market trend data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getSupportedBlockchains();
  }, []);

  useEffect(() => {
    fetchData();
  }, [blockchain, metric, timeRange]);

  return (
    <div className="mb-5 mt-2 flex items-center justify-center flex-col gap-4">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 w-full bg-zinc-800 p-4 rounded-lg shadow-md z-50">
        <div className="flex gap-4 justify-center">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "trends"
                ? "border-2 border-[#646cff] text-[#646cff]"
                : "bg-zinc-700 text-gray-300"
            }`}
            onClick={() => setActiveTab("trends")}
          >
            Market Trends
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "nft-list"
                ? "border-2 border-[#646cff] text-[#646cff]"
                : "bg-zinc-700 text-gray-300"
            }`}
            onClick={() => setActiveTab("nft-list")}
          >
            NFT List
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "wallet-analytics"
                ? "border-2 border-[#646cff] text-[#646cff]"
                : "bg-zinc-700 text-gray-300"
            }`}
            onClick={() => setActiveTab("wallet-analytics")}
          >
            Wallet Analytics
          </button>
        </div>
      </nav>

      {/* Conditional Rendering */}
      {activeTab === "trends" ? (
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <ChainSelect
              blockchain={blockchain}
              setBlockchain={setBlockchain}
              optionBlockchain={optionBlockchain}
              val="id"
            />
            <MetricSelect metric={metric} setMetric={setMetric} metricsData={metricsData} />
            <SelectTimerange timeRange={timeRange} setTimeRange={setTimeRange} />
          </div>
          {isLoading ? (
            <div className="skeleton skeleton-spinner"></div>
          ) : (
            <div className="flex flex-col min-w-[500px] items-center gap-5 overflow-x-auto">
              <Chart data={data} metric={metric} />
              <Predictor data={data} metric={metric} />
            </div>
          )}
        </div>
      ) : activeTab === "nft-list" ? (
        <div className="flex flex-col items-center gap-4">
          <NftList optionBlockchain={optionBlockchain} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <WalletAnalytics optionBlockchain={optionBlockchain} />
        </div>
      )}
    </div>
  );
};

export default App;