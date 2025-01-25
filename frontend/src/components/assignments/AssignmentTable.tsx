import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface AssignmentTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  page: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
}

export function AssignmentTable<TData, TValue>({
  columns,
  data,
  page,
  pageSize,
  totalCount,
  onPageChange,
}: AssignmentTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-gray-50 hover:bg-gray-50"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="px-6 py-4 text-sm font-semibold text-left text-gray-900"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="transition-colors border-t border-gray-200 hover:bg-gray-50"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="px-6 py-4 text-sm text-gray-700"
                  >
                    {cell.column.id === 'status' ? (
                      <span className={cell.getValue() ? 'text-green-500' : 'text-red-500'}>
                        {cell.getValue() ? 'Activo' : 'Inactivo'}
                      </span>
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
                className="h-24 text-sm text-center text-gray-500"
              >
                No se encontraron resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationPrevious
          onClick={() => onPageChange(page - 1)}
        >
          Anterior
        </PaginationPrevious>
        <PaginationContent>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => onPageChange(index + 1)}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>
        <PaginationNext
          onClick={() => onPageChange(page + 1)}
        >
          Siguiente
        </PaginationNext>
      </Pagination>
    </div>
  )
}