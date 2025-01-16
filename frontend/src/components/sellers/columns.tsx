import Seller from "@/model/Seller"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Seller>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "last_name",
    header: "Apellido",
  },
  {
    accessorKey: "dni",
    header: "DNI",
  },
  {
    accessorKey: "status",
    header: "Estado",
  },
  {
    accessorKey: "number_seller",
    header: "Numero Cliente",
  }
] 