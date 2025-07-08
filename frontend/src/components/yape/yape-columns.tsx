import { ColumnDef } from "@tanstack/react-table";
import { CashRow } from "@/models/Cash";

export const yapeColumns = (): ColumnDef<CashRow>[] => [
  {
    id: "index",
    header: "ID",
    cell: ({ row }) => row.index + 1,
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Nombre",
    cell: ({ getValue }) => {
      const value = getValue() as string | number;
      return value.toString();
    },
  },
  {
    id: "amount",
    accessorKey: "amount",
    header: "Monto (S/.)",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return `S/ ${value.toFixed(2)}`;
    },
  },
  {
    id: "date_yape",
    accessorKey: "date_yape",
    header: "Fecha",
    cell: ({ getValue }) => {
      const value = getValue() as string | number;
      return value.toString();
    },
  },
  {
    id: "operation_code",
    accessorKey: "operation_code",
    header: "Código de Operación",
    cell: ({ getValue }) => {
      const value = getValue() as string | number;
      return value.toString();
    },
  },
];
