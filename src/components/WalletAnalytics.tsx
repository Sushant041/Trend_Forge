import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "../components/Table";
import { SelectTimerange } from "./SelectTimerange";
import ChainSelect from "./chainSelect";
import selectStyles from "./DropdownStyle";
import Select from "react-select";

interface WalletData {
  wallet: string;
  blockchain: string;
  volume: number;
  transactions: number;
  nft_bought: number;
  nft_sold: number;
  sales: number;
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

interface WalletListProp{
    optionBlockchain: Blockchain[]
}

const WalletAnalytics: React.FC<WalletListProp> = ({optionBlockchain}) => {
  const [data, setData] = useState<WalletData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters
  const [blockchain, setBlockchain] = useState<string | number>("ethereum");
  const [sortBy, setSortBy] = useState<string| number>("volume");
  const [timeRange, setTimeRange] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          "https://api.unleashnfts.com/api/v2/nft/wallet/analytics",
          {
            params: {
              blockchain: blockchain, // Use selected blockchain
              time_range: timeRange, // Use selected time range
              sort_by: sortBy, // Use selected sort by
              sort_order: "desc", // Default sort order
              offset: 0,
              limit: 30,
            },
            headers: {
              "x-api-key": "cbe32ab2a4ce0186852a6a5299b214fd",
            },
          }
        );
        setData(
          response.data.data.map((item: any) => ({
            wallet: item.wallet,
            blockchain: item.blockchain,
            volume: item.volume,
            transactions: item.transactions,
            nft_bought: item.nft_bought,
            nft_sold: item.nft_sold,
            sales: item.sales,
          }))
        );
      } catch (err) {
        console.error(err);
        setError("Failed to fetch wallet analytics.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [blockchain, sortBy, timeRange]); // Re-fetch data when filters change

  const columns = React.useMemo(
    () => [
      {
        Header: "Wallet",
        accessor: "wallet",
      },
      {
        Header: "Blockchain",
        accessor: "blockchain",
      },
      {
        Header: "Volume ($)",
        accessor: "volume",
        Cell: ({ value }: { value: number }) => `$${value}`,
      },
      {
        Header: "Transactions",
        accessor: "transactions",
        Cell: ({ value }: { value: number }) => value.toLocaleString(),
      },
      {
        Header: "NFTs Bought",
        accessor: "nft_bought",
        Cell: ({ value }: { value: number }) => value.toLocaleString(),
      },
      {
        Header: "NFTs Sold",
        accessor: "nft_sold",
        Cell: ({ value }: { value: number }) => value.toLocaleString(),
      },
      {
        Header: "Sales",
        accessor: "sales",
        Cell: ({ value }: { value: number }) => value.toLocaleString(),
      },
    ],
    []
  );

  const SortedByOptions = [
    { value: "volume", label: "Volume" },
    { value: "sales", label: "Sales" },
    { value: "transactions", label: "Transactions" },
    { value: "transfers", label: "Transfers" },
    { value: "nft_burn", label: "NFT Burn" },
    { value: "nft_transfer", label: "NFT Transfer" },
    { value: "nft_mint", label: "NFT Mint" },
    { value: "nft_bought", label: "NFT Bought" },
    { value: "nft_sold", label: "NFT Sold" },
    { value: "minted_value", label: "Minted Value" },
    { value: "volume_change", label: "Volume Change" },
    { value: "sales_change", label: "Sales Change" },
    { value: "transactions_change", label: "Transactions Change" },
    { value: "transfers_change", label: "Transfers Change" },
    { value: "nft_burn_change", label: "NFT Burn Change" },
    { value: "nft_transfer_change", label: "NFT Transfer Change" },
    { value: "nft_mint_change", label: "NFT Mint Change" },
    { value: "nft_bought_change", label: "NFT Bought Change" },
    { value: "nft_sold_change", label: "NFT Sold Change" },
    { value: "minted_value_change", label: "Minted Value Change" },
    { value: "buy_volume", label: "Buy Volume" },
    { value: "sell_volume", label: "Sell Volume" },
  ];
  
  return (
    <div className="container mx-auto p-6 flex flex-col items-center">
      {/* Filters */}
      <div className="flex flex-wrap gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-200">Blockchain</label>
          <ChainSelect optionBlockchain={optionBlockchain} setBlockchain={setBlockchain} blockchain={blockchain} val="name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200">Sort By</label>
          <Select
            id="metrics-select"
            options={SortedByOptions}
            value={SortedByOptions.find((option) => option?.value === sortBy)}
            onChange={(selectedOption) =>
              setSortBy(selectedOption?.value || "volume")
            }
            placeholder="Metrics"
            className="react-select-container"
            styles={selectStyles}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200">Time Range</label>
          <SelectTimerange timeRange={timeRange} setTimeRange={setTimeRange} />
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="min-w-[900px] flex flex-col gap-1">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="skeleton h-10 bg-gray-300"
            ></div>
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Table columns={columns} data={data} />
      )}
    </div>
  );
};

export default WalletAnalytics;