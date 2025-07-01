import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { columns } from './columns';
import { Finance } from "@/models/Finance";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FinancesProps {
  data: Finance[];
  page: number;
  pageSize: number;
  totalCount: number
  onPageChange: (page: number) => void;
}

const FinancesTable: React.FC<FinancesProps> = ({ data, page, pageSize, totalCount, onPageChange }) => {

  const table = useReactTable({
    data,
    columns: columns(page, pageSize),
    getCoreRowModel: getCoreRowModel(),
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className={`px-6 py-3 text-sm font-medium tracking-wider text-left text-gray-500 uppercase bg-blue-50 ${header.column.id === 'actions' ? 'action-column' : ''}`}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="px-2 py-4 whitespace-nowrap"
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col items-center justify-between px-2 mt-6 bg-blue-50 md:flex-row">
        <div className="p-4 text-sm font-medium text-gray-500">
          Página {page} de {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => page > 1 && onPageChange(page - 1)}
            disabled={page <= 1}
            className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 cursor-pointer transition-colors duration-200 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
          </button>

          <div className="flex items-center">
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              const isCurrentPage = pageNumber === page;
              const isFirstPage = pageNumber === 1;
              const isLastPage = pageNumber === totalPages;
              const isWithinRange = Math.abs(pageNumber - page) <= 1;

              if (isFirstPage || isLastPage || isWithinRange) {
                return (
                  <button
                    key={index}
                    onClick={() => onPageChange(pageNumber)}
                    className={`
                inline-flex items-center justify-center w-10 h-10 text-sm font-medium
                transition-colors duration-200 rounded-lg focus:outline-none
                ${isCurrentPage
                        ? 'bg-blue-50 text-gray-500'
                        : 'text-gray-700 hover:bg-gray-50'
                      }
              `}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                (pageNumber === page - 2 && pageNumber > 2) ||
                (pageNumber === page + 2 && pageNumber < totalPages - 1)
              ) {
                return (
                  <span
                    key={index}
                    className="px-2 text-gray-400"
                  >
                    •••
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            onClick={() => page < totalPages && onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 cursor-pointer transition-colors duration-200 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancesTable;