import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Yape } from "@/models/Yape";

interface YapeProps {
  data: Yape[];
}

const YapeTable: React.FC<YapeProps> = ({ data }) => {
  const columns = useMemo<ColumnDef<Yape>[]>(() => [
    {
      id: "index",
      header: "ID",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "date_yape",
      header: "Fecha",
    },
    {
      accessorKey: "name",
      header: "Nombre",
    },
    {
      accessorKey: "operation_code",
      header: "Código de Operación",
    },
    {
      id: "amount",
      accessorKey: "amount",
      header: "Monto (S/.)",
      cell: ({ getValue }) => {
        const value = Number(getValue()) || 0;
        return `S/ ${value.toFixed(2)}`;
      },
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalAmount = useMemo(
    () => data.reduce((sum, row) => sum + (Number(row.amount) || 0), 0),
    [data]
  );

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-sm font-medium tracking-wider text-left text-gray-500 uppercase bg-blue-50"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-2 py-4 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}

          {/* Fila de total */}
          <tr className="bg-gray-100 font-semibold">
            <td className="px-2 py-4" colSpan={columns.length - 2}>
              Total
            </td>
            <td className="px-2 py-4 text-right" colSpan={2}>
              S/ {totalAmount.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default YapeTable;
