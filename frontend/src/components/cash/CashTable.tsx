import React, { useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { cashColumns as buildColumns } from "./cash-columns";
import { Cash, defaultCash } from "@/models/Cash";
import { cashToRows, CashRow } from "@/models/Cash";

interface CashProps {
  data: Cash[];
  cashRows: CashRow[];
  setCashRows: React.Dispatch<React.SetStateAction<CashRow[]>>;
}

const CashTable: React.FC<CashProps> = ({ data, cashRows, setCashRows }) => {
  const prevDataRef = useRef<Cash[]>([]);

  useEffect(() => {
    // Solo actualizar si los datos han cambiado realmente
    const dataChanged =
      prevDataRef.current.length !== data.length ||
      (data.length > 0 && prevDataRef.current[0] !== data[0]);

    if (dataChanged) {
      if (data.length > 0) {
        setCashRows(cashToRows(data[0]));
      } else {
        setCashRows(cashToRows(defaultCash));
      }
      prevDataRef.current = data;
    }
  }, [data, setCashRows]);

  const getDenominationValue = (label: string): number => {
    return parseFloat(label.replace("S/", "").replace(",", ".").trim());
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    setCashRows(prev =>
      prev.map((row, i) =>
        i === index
          ? { ...row, quantity: newQuantity, total: newQuantity * getDenominationValue(row.denomination) }
          : row
      )
    );
  };

  const columns = buildColumns(handleQuantityChange);
  const table = useReactTable({ data: cashRows, columns, getCoreRowModel: getCoreRowModel() });

  const totalAmount = cashRows.reduce((sum, row) => sum + row.total, 0);

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className={`px-6 py-3 text-sm font-medium tracking-wider text-left text-gray-600 uppercase bg-accent`}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-2 py-2 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {/* Total Row */}
          <tr className="bg-gray-100 font-semibold">
            <td className="px-2 py-4" colSpan={2}>Total</td>
            <td className="px-2 py-4 text-right">
              S/ {totalAmount.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CashTable;