import { ColumnDef } from "@tanstack/react-table";
import { CashRow } from "@/models/Cash";
import EditableCell from "./editable-cell";

export const cashColumns = (
  onQuantityChange: (index: number, newQuantity: number) => void
): ColumnDef<CashRow>[] => [
    {
      id: "denomination",
      accessorKey: "denomination",
      header: "Billete/Moneda",
    },
    {
      id: "quantity",
      accessorKey: "quantity",
      header: "Cantidad",
      cell: ({ row, getValue }) => (
        <EditableCell
          value={getValue() as number}
          onValueChange={(val: number) => onQuantityChange(row.index, val)}
        />
      ),
    },
    {
      id: "total",
      accessorKey: "total",
      header: "Total (S/.)",
      cell: ({ getValue }) => {
        const value = getValue() as number;
        return `S/ ${value.toFixed(2)}`;
      },
    },
  ];
