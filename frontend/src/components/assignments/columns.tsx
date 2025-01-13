import { Assignment } from "@/model/Assignment"
import Seller from "@/model/Seller";
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Assignment>[] = [
  {
    accessorKey: "seller",
    header: "Nombre completo",
    cell: ({ getValue }) => {
      const seller = getValue() as Seller;
      return `${seller.name} ${seller.last_name}`;
    },
  },
  {
    accessorKey: "date_assignment",
    header: "Fecha de asignación",
  },
  {
    accessorKey: "status",
    header: "Estado",
  },
] 