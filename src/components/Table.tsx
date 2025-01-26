import React from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  Column,
  TableInstance,
  UseSortByInstanceProps,
  UsePaginationInstanceProps,
  UseSortByState,
  UsePaginationState,
} from "react-table";

// Define the type for the data
interface TableData {
  [key: string]: any; // Replace with specific fields if known
}

// Define the type for the columns
interface TableColumns extends Column<TableData> {
  Header: string;
  accessor: string;
}

// Define the props for the Table component
interface TableProps {
  columns: TableColumns[];
  data: TableData[];
}

// Combine all table instance types
type TableInstanceWithHooks<T extends object> = TableInstance<T> &
  UseSortByInstanceProps<T> &
  UsePaginationInstanceProps<T> & {
    state: UseSortByState<T> & UsePaginationState<T>;
  };

const Table: React.FC<TableProps> = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable<TableData>(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }, // Default page size
    },
    useSortBy,
    usePagination
  ) as TableInstanceWithHooks<TableData>; // Cast to combined type

  return (
    <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-gray-900 p-6 rounded-lg shadow-lg overflow-x-auto">
      <table
        {...getTableProps()}
        className="w-full border-collapse"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="p-3 text-left text-purple-200 bg-purple-800 border-b border-purple-600"
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className="hover:bg-purple-800 transition"
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="p-3 text-blue-100 border-b border-purple-600"
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="px-4 py-2 bg-purple-700 text-purple-100 rounded disabled:opacity-50 hover:bg-purple-600 transition"
        >
          Previous
        </button>
        <span className="text-pink-200">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="px-4 py-2 bg-purple-700 text-purple-100 rounded disabled:opacity-50 hover:bg-purple-600 transition"
        >
          Next
        </button>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="ml-4 p-2 bg-purple-700 text-purple-100 border border-purple-600 rounded hover:bg-purple-600 transition"
        >
          {[10, 20, 30, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Table;