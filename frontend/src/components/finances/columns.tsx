
import { ColumnDef } from "@tanstack/react-table";
import { Finance } from "@/models/Finance";

export const columns = (page: number, pageSize: number): ColumnDef<Finance>[] => [
  {
    id: "index",
    header: "ID",
    cell: ({ row }) => (page - 1) * pageSize + row.index + 1,
  },
  {
    id: "date_finance",
    accessorKey: "date_finance",
    header: "Fecha"
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Descripción"
  },
  {
    id: "amount",
    accessorKey: "amount",
    header: "Monto (S/.)"
  },
]

