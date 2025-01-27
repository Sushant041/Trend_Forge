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
import TradersTrend from "./components/TradersTrend.tsx";
import WashtradeInsights from "./components/WashTardeINsight.tsx";

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

interface MarketTrendData {
  timestamp: string;
  [key: string]: number;
}

interface TradersData {
  block_dates: string[];
  traders_trend: number[];
  traders_buyers_trend: number[];
  traders_sellers_trend: number[];
}

const App: React.FC = () => {
  const [data, setData] = useState<MarketTrendData[]>([]);
  const [metric, setMetric] = useState<string>("volume");
  const [blockchain, setBlockchain] = useState<number | string>(1);
  const [blockchainString, setBlockchainString] = useState<string>("ethereum");
  const [optionBlockchain, setOptionBlockchain] = useState<Blockchain[]>([]);
  const [timeRange, setTimeRange] = useState<string>("24h"); // Default time range
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "trends" | "nft-list" | "wallet-analytics"
  >("trends");
  const [Tradersdata, setTradersData] = useState<TradersData | null>(null);
  const [washtradeData, setWashtradeData] = useState<{
    block_dates: string[];
    washtrade_assets_trend: number[];
    washtrade_suspect_sales_trend: number[];
    washtrade_volume_trend: number[];
  } | null>(null);

  // Fetch all data in one go using Promise.all
  const fetchAllData = async () => {
    console.log(blockchain, blockchainString)
    setIsLoading(true);
    try {
      const [
        blockchainsResponse,
        marketTrendResponse,
        tradersResponse,
        washtradeResponse,
      ] = await Promise.all([
        // Fetch supported blockchains
        axios.get("https://api.unleashnfts.com/api/v1/blockchains", {
          params: {
            sort_by: "blockchain_name",
            offset: 0,
            limit: 30,
            "x-api-key": "cbe32ab2a4ce0186852a6a5299b214fd",
          },
          headers: {
            Authorization: "cbe32ab2a4ce0186852a6a5299b214fd",
          },
        }),
        
        // Fetch market trend data
        axios.get("https://api.unleashnfts.com/api/v1/market/trend", {
          params: {
            currency: "usd",
            blockchain: blockchain,
            metrics: metric,
            time_range: timeRange,
            include_washtrade: "true",
            "x-api-key": "df51d1d20cd88215009bea3b1861cf4d",
          },
          headers: {
            Authorization: "df51d1d20cd88215009bea3b1861cf4d",
          },
        }),

        // Fetch traders data
        axios.get(
          "https://api.unleashnfts.com/api/v2/nft/market-insights/traders",
          {
            headers: {
              accept: "application/json",
              "x-api-key": "df51d1d20cd88215009bea3b1861cf4d",
            },
            params: {
              blockchain: blockchainString,
              time_range: timeRange,
            },
          }
        ),

        axios.get(
          "https://api.unleashnfts.com/api/v2/nft/market-insights/washtrade",
          {
            headers: {
              accept: "application/json",
              "x-api-key": "df51d1d20cd88215009bea3b1861cf4d",
            },
            params: {
              blockchain: blockchainString,
              time_range: timeRange,
            },
          }
        ),
      ]);

      // Set blockchains data
      setOptionBlockchain(blockchainsResponse.data.blockchains);

      // Set market trend data
      const validMarketTrendData = marketTrendResponse.data.data_points
        .filter(
          (item: { values: { [key: string]: string | number } }) =>
            item.values[metric] !== "NA"
        )
        .map((item: { date: string; values: { [key: string]: number } }) => ({
          timestamp: format(new Date(item.date), "MMM dd, yyyy HH:mm"),
          [metric]: item.values[metric],
        }));
      setData(validMarketTrendData);

      // Set traders data
      const tradersData = tradersResponse.data.data[0];
      console.log(tradersData);
      // Create the structured data as per the TrendData interface
      const formattedData = {
        block_dates: tradersData.block_dates.map((date: string) =>
          format(new Date(date), "MMM dd, yyyy HH:mm")
        ), // Format the dates
        traders_trend: tradersData.traders_trend, // Use the traders' trend data
        traders_buyers_trend: tradersData.traders_buyers_trend, // Use the buyers' trend data
        traders_sellers_trend: tradersData.traders_sellers_trend, // Use the sellers' trend data
      };
      setTradersData(formattedData);

      const washtradeData = washtradeResponse.data.data[0];
      console.log(washtradeData);
      const formattedWashtradeData = {
        block_dates: washtradeData.block_dates.map((date: string) =>
          format(new Date(date), "MMM dd, yyyy HH:mm")
        ),
        washtrade_assets_trend: washtradeData.washtrade_assets_trend,
        washtrade_suspect_sales_trend:
          washtradeData.washtrade_suspect_sales_trend,
        washtrade_volume_trend: washtradeData.washtrade_volume_trend,
      };
      setWashtradeData(formattedWashtradeData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [blockchain, metric, timeRange]);

  return (
    <div className="mb-5 mt-2 flex items-center justify-center flex-col gap-4">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 w-full bg-zinc-800 p-4 rounded-lg shadow-md z-50">
        <div className="flex gap-4 justify-center">
          <button
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "trends"
                ? "border-2 border-[#646cff] text-[#646cff]"
              : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
            }`}
            onClick={() => setActiveTab("trends")}
          >
            Market Trends
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "nft-list"
                ? "border-2 border-[#646cff] text-[#646cff]"
              : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
            }`}
            onClick={() => setActiveTab("nft-list")}
          >
            NFT List
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "wallet-analytics"
                ? "border-2 border-[#646cff] text-[#646cff]"
              : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
            }`}
            onClick={() => setActiveTab("wallet-analytics")}
          >
            Wallet Analytics
          </button>
        </div>
      </nav>

      {/* Conditional Rendering */}
      {activeTab === "trends" ? (
        <div className="w-full max-w-7xl px-4">
          {/* Filters */}
          <div className="flex gap-4 justify-center mb-8">
            <ChainSelect
              blockchain={blockchain}
              setBlockchain={setBlockchain}
              optionBlockchain={optionBlockchain}
              setBlockchainString={setBlockchainString}
              val="id"
            />
            <MetricSelect
              metric={metric}
              setMetric={setMetric}
              metricsData={metricsData}
            />
            <SelectTimerange
              timeRange={timeRange}
              setTimeRange={setTimeRange}
            />
          </div>

          {/* Charts Grid */}
          {isLoading ? (
            <div className="flex md:flex-row flex-col gap-3">
              <div className="skeleton skeleton-spinner"></div>
              <div className="skeleton skeleton-spinner"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Market Trends Chart */}
              <div className="bg-zinc-800 p-6 rounded-lg shadow-md overflow-auto">
                <h3 className="text-xl font-semibold mb-4">Market Trends</h3>
                <div className="h-80">
                  <Chart data={data} metric={metric} />
                </div>
              </div>

              {/* Predictor Section */}
              <div className="bg-zinc-800 p-6 flex flex-col gap-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">
                  Market Predictions
                </h3>
                <Predictor data={data} metric={metric} />
              </div>

              {/* Traders Trend Chart */}
              <div className="bg-zinc-800 p-6 rounded-lg shadow-md overflow-auto">
                <h3 className="text-xl font-semibold mb-4">Traders Trend</h3>
                <div className="h-80">
                  <TradersTrend data={Tradersdata} />
                </div>
              </div>
                <WashtradeInsights data={washtradeData} />
            </div>
          )}
        </div>
      ) : activeTab === "nft-list" ? (
        <div className="w-full max-w-7xl px-4">
          <NftList optionBlockchain={optionBlockchain} />
        </div>
      ) : (
        <div className="w-full max-w-7xl px-4">
          <WalletAnalytics optionBlockchain={optionBlockchain} />
        </div>
      )}
    </div>
  );
};

export default App;
