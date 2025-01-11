import { Product } from "@/model/Product"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "type",
    header: "Tipo",
  },
  {
    accessorKey: "returns_date",
    header: "Dias para retornar",
  },
] 