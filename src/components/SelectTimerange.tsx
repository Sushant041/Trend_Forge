import React from "react";
import Select from "react-select";


const timeRangeOptions = [
    { value: "24h", label: "1 Day" },
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
    { value: "all", label: "all time" },
  ];

interface SelectTimerangeProps {
    timeRange: string;
    setTimeRange: (value: string) => void;
}

export const SelectTimerange :React.FC<SelectTimerangeProps> = ({timeRange, setTimeRange}) => {
  return (
    <div>
          <Select
            options={timeRangeOptions}
            value={timeRangeOptions.find((option) => option.value === timeRange)}
            onChange={(selectedOption) => setTimeRange(selectedOption?.value || "90d")}
            className="react-select-container"
            styles={{
              control: (base) => ({
                ...base,
                border: "1px solid rgba(82, 82, 91, 1)",
                padding: "0.25rem 0.5rem",
                borderRadius: "0.25rem",
                backgroundColor: "rgba(39, 39, 42, 1)",
                maxWidth: "250px",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "rgba(39, 39, 42, 1)",
                borderRadius: "0.25rem",
              }),
              option: (base, { isFocused, isSelected }) => ({
                ...base,
                backgroundColor: isSelected
                  ? "rgba(59, 130, 246, 1)"
                  : isFocused
                  ? "rgba(82, 82, 91, 1)"
                  : "transparent",
                color: isSelected ? "white" : "rgba(229, 231, 235, 1)",
                padding: "0.5rem",
                cursor: "pointer",
              }),
              singleValue: (base) => ({
                ...base,
                color: "rgba(229, 231, 235, 1)",
              }),
            }}
          />
        </div>
  );
}
