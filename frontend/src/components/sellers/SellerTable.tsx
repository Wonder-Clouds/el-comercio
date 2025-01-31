import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { RefObject } from "react";
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface SellerTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  tableRef: RefObject<HTMLDivElement>;
}

export function SellerTable<TData, TValue>({
  columns,
  data,
  page,
  pageSize,
  totalCount,
  tableRef,
  onPageChange
}: SellerTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div ref={tableRef} className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    className={`px-6 py-4 text-sm font-semibold text-gray-700 bg-gray-50 first:rounded-tl-lg last:rounded-tr-lg border-b border-gray-200 ${index === columns.length - 1 ? 'no-print' : ''
                      }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  className={`
                    border-b border-gray-100 last:border-0
                    transition-colors duration-200
                    hover:bg-gray-50/70
                    ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
                  `}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={`px-6 py-4 text-sm text-gray-600 ${index === columns.length - 1 ? 'no-print' : ''
                        }`}
                    >
                      {cell.column.id === 'status' ? (
                        <div className="flex items-center gap-2">
                          {cell.getValue() ? (
                            <>
                              <div className="relative flex">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span className="absolute top-0 left-0 w-5 h-5 bg-green-400 rounded-full animate-ping opacity-20" />
                              </div>
                              <span className="font-medium text-green-600">Activo</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5 text-red-500 animate-pulse" />
                              <span className="font-medium text-red-600">Inactivo</span>
                            </>
                          )}
                        </div>
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-8 text-center text-gray-500"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col items-center justify-between px-2 mt-6 md:flex-row">
        <div className="p-4 text-sm font-medium text-gray-500">
          Página {page} de {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => page > 1 && onPageChange(page - 1)}
            disabled={page <= 1}
            className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}