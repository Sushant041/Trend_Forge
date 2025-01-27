import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import ChainSelect from "./chainSelect";
import { SelectTimerange } from "./SelectTimerange.tsx";
import selectStyles from "./DropdownStyle.tsx";
import { SortOptionList, NftmetricsOptions } from "../data/DataLists";
import no_image_nft from "../assets/no-image-nft.webp";

// Interfaces
interface NFT {
  metadata: {
    token_id: string;
    name: string;
    collection_name: string;
    chain_id: number;
    minted_date: string;
    token_image_url: string;
    thumbnail_url: string;
    address: string;
    thumbnail_palette: string[];
    verified: boolean;
  };
  metric_values: {
    price: {
      value: string;
      unit: string;
    };
  };
}

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
interface NftListProps {
  optionBlockchain: Blockchain[];
}
interface OrderOptionType {
  value: string; // The value type should match sortOrder's type
  label: string;
}

const App: React.FC<NftListProps> = ({ optionBlockchain }) => {
  // State variables
  const [blockchain, setBlockchain] = useState<number | string>(1); // Default to Ethereum
  const [sortBy, setSortBy] = useState<string>("price");
  const [metrics, setMetrics] = useState<string>("price");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [nftTimeRange, setNftTimeRange] = useState<string>("24h");
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const orderOptions: OrderOptionType[] = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
  ];

  // Fetch NFTs
  const fetchNFTs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://api.unleashnfts.com/api/v1/nfts",
        {
          params: {
            currency: "usd",
            blockchain: blockchain,
            metrics: "price",
            sort_by: sortBy,
            sort_order: sortOrder,
            offset: 0,
            limit: 30,
            time_range: nftTimeRange,
            "x-api-key": "cbe32ab2a4ce0186852a6a5299b214fd",
          },
          headers: {
            Authorization: "cbe32ab2a4ce0186852a6a5299b214fd", // Replace with your API key
          },
        }
      );
      setNfts(response.data.nfts); // Adjust this based on actual API response
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNFTs();
  }, [blockchain, sortBy, sortOrder, nftTimeRange]);

  // Render function
  return (
    <div className="my-5 flex items-center justify-center flex-col gap-4">
      {/* <h1 className="text-3xl font-bold mb-4">NFT By Chain</h1> */}

      {/* Blockchain, Sorting, and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Blockchain Selector */}
        <div className="flex flex-col">
          <label
            htmlFor="blockchain-select"
            className="text-sm font-medium mb-1"
          >
            Blockchain
          </label>
          <ChainSelect
            optionBlockchain={optionBlockchain}
            setBlockchain={setBlockchain}
            blockchain={blockchain}
            val="id"
          />
        </div>

        {/* Metrics Selector */}
        <div className="flex flex-col">
          <label htmlFor="metrics-select" className="text-sm font-medium mb-1">
            Metrics
          </label>
          <Select
            id="metrics-select"
            options={NftmetricsOptions}
            value={NftmetricsOptions.find((option) => option.value === metrics)}
            onChange={(selectedOption) =>
              setMetrics(selectedOption?.value || "price")
            }
            placeholder="Metrics"
            className="react-select-container"
            styles={selectStyles}
          />
        </div>

        {/* Sort By Selector */}
        <div className="flex flex-col">
          <label htmlFor="sort-by-select" className="text-sm font-medium mb-1">
            Sort By
          </label>
          <Select
            id="sort-by-select"
            options={SortOptionList}
            value={SortOptionList.find((option) => option.value === sortBy)}
            onChange={(selectedOption) =>
              setSortBy(selectedOption?.value || "price")
            }
            placeholder="Sort By"
            className="react-select-container"
            styles={selectStyles}
          />
        </div>

        {/* Order Selector */}
        <div className="flex flex-col">
          <label htmlFor="order-select" className="text-sm font-medium mb-1">
            Order
          </label>
          <Select
            id="order-select"
            options={orderOptions}
            value={orderOptions.find((option) => option.value === sortOrder)}
            onChange={(selectedOption) =>
              setSortOrder(selectedOption?.value || "desc")
            }
            placeholder="Order"
            className="react-select-container"
            styles={selectStyles}
          />
        </div>

        {/* Time Range Selector */}
        <div className="flex flex-col">
          <label
            htmlFor="time-range-select"
            className="text-sm font-medium mb-1"
          >
            Time Range
          </label>
          <SelectTimerange
            timeRange={nftTimeRange}
            setTimeRange={setNftTimeRange}
          />
        </div>
      </div>

      {/* NFT List */}
      {isLoading ? (
        <div className="flex w-full gap-4">
          <div className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-price"></div>
          </div>
          <div className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-price"></div>
          </div>
          <div className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-price"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {nfts.map((nft, index) => (
            <div
              key={index}
              className="card p-4 border rounded-lg shadow-md max-w-[400px] bg-gradient-to-br from-zinc-600 to-zinc-900"
            >
              <img
                src={
                  nft.metadata.token_image_url ||
                  nft.metadata.thumbnail_url ||
                  no_image_nft
                }
                alt={nft.metadata.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3
                className="text-lg font-bold mt-2 text-gray-100 truncate"
                title={nft.metadata.name}
              >
                {nft.metadata.name.length > 40
                  ? `${nft.metadata.name.substring(0, 40)}...`
                  : nft.metadata.name}
              </h3>
              <p className="text-sm text-gray-300">
                Collection: {nft.metadata.collection_name}
              </p>
              <p className="text-sm text-gray-300">
                Price:{" "}
                <span className="font-semibold text-green-400">
                  ${parseFloat(nft.metric_values.price.value).toFixed(2)}
                </span>{" "}
                {nft.metric_values.price.unit}
              </p>
              <p className="text-sm text-gray-300">
                Minted:{" "}
                <span className="font-semibold text-blue-400">
                  {new Date(nft.metadata.minted_date).toLocaleString()}
                </span>
              </p>
              <p
                className="text-sm text-gray-300 truncate"
                title={nft.metadata.address}
              >
                Address: {nft.metadata.address.substring(0, 10)}...
                {nft.metadata.address.slice(-8)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
