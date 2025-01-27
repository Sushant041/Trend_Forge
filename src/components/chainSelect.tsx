import React from "react";
import Select from "react-select";

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

interface ChainSelectProps {
  optionBlockchain: Blockchain[];
  setBlockchain: (value: number | string) => void;
  setBlockchainString: (value : string) => void;
  blockchain: number | string;
  val: string
}

const ChainSelect: React.FC<ChainSelectProps> = ({
  optionBlockchain,
  setBlockchain,
  setBlockchainString,
  blockchain,
  val,
}) => {
  const blockchainOptions = optionBlockchain.map((item: Blockchain) => ({
    value: item.metadata.id,
    label: item.metadata.name,
    icon: item.metadata.thumbnail_url,
    name: item.metadata.name,
  }));

  // Custom component to render each option with an image
  const formatOptionLabel = ({
    label,
    icon,
  }: {
    label: string;
    icon: string;
  }) => (
    <div className="flex items-center gap-2">
      <img src={icon} alt={label} className="w-6 h-6 rounded-full" />
      <span>{label}</span>
    </div>
  );
  return (
    <Select
      options={blockchainOptions}
      value={blockchainOptions.find((option) => {
        const res = val === "id" ? option.value === blockchain : option.name === blockchain;
        return res})
      }
      formatOptionLabel={formatOptionLabel}
      onChange={(selectedOption) => {
        setBlockchain(val === "id" ? selectedOption?.value || 1 : selectedOption?.name === "Ordinals" ? "bitcoin" : selectedOption?.name?.split(" ")[0].toLowerCase() || "Ethereum")
        setBlockchainString(selectedOption?.name === "Ordinals" ? "bitcoin" : selectedOption?.name?.split(" ")[0].toLowerCase() || "ethereum")
      }}
      className="react-select-container"
      styles={{
        control: (base) => ({
          ...base,
          border: "1px solid rgba(82, 82, 91, 1)", // Tailwind's border
          padding: "0.25rem 0.5rem", // Tailwind's p-2
          borderRadius: "0.25rem", // Tailwind's rounded
          backgroundColor: "rgba(39, 39, 42, 1)", // Tailwind's bg-zinc-800
          maxWidth: "250px", // Tailwind's max-w-[150px]
          overflow: "hidden",
          textOverflow: "ellipsis", // Tailwind's text-ellipsis
          whiteSpace: "nowrap",
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: "rgba(39, 39, 42, 1)", // Tailwind's bg-zinc-800
          borderRadius: "0.25rem", // Tailwind's rounded
        }),
        option: (base, { isFocused, isSelected }) => ({
          ...base,
          backgroundColor: isSelected
            ? "rgba(59, 130, 246, 1)" // Tailwind's bg-blue-500
            : isFocused
            ? "rgba(82, 82, 91, 1)" // Tailwind's bg-zinc-700
            : "transparent",
          color: isSelected ? "white" : "rgba(229, 231, 235, 1)", // Tailwind's text-gray-200
          padding: "0.5rem", // Tailwind's p-2
          cursor: "pointer",
        }),
        singleValue: (base) => ({
          ...base,
          color: "rgba(229, 231, 235, 1)", // Tailwind's text-gray-200
          maxWidth: "150px", // Ensure it applies the max width
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }),
      }}
    />
  );
};

export default ChainSelect;
