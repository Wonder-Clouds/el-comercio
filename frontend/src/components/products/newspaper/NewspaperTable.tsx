import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { RefObject } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/models/Product";
import { updateProduct } from "@/api/Product.api";
import { columnsNewspaper } from "./columns-newspaper";

interface NewspaperTableProps {
  data: Product[];
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  tableRef: RefObject<HTMLDivElement>;
}

export function NewspaperTable({
  data,
  page,
  pageSize,
  totalCount,
  tableRef,
  onPageChange
}: NewspaperTableProps) {
  const handleValueChange = async (
    productId: number, 
    value: string | number
  ) => {
    try {
      const currentProduct = data.find(p => p.id === productId);
      
      if (!currentProduct) {
        console.error('Product not found');
        return;
      }
  
      const updatedProduct: Product = {
        ...currentProduct,
        ...(typeof value === 'string' && { name: value }),
        ...(typeof value === 'number' && { 
          returns_date: value,
          monday_price: value,
          tuesday_price: value,
          wednesday_price: value,
          thursday_price: value,
          friday_price: value
        })
      };
  
      await updateProduct(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const table = useReactTable({
    data,
    columns: columnsNewspaper(handleValueChange),
    getCoreRowModel: getCoreRowModel(),
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div ref={tableRef} className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50"
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
                    className="px-6 py-4 whitespace-nowrap"
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
      </div>
      <div className="flex flex-col items-center justify-between px-2 mt-6 md:flex-row">
        <div className="p-4 text-sm font-medium text-gray-500">
          Página {page} de {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => page > 1 && onPageChange(page - 1)}
            disabled={page <= 1}
            className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Anterior
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
            className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}