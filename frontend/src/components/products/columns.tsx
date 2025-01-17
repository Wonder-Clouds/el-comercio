import { ProductPrice } from "@/model/ProductPrice"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<ProductPrice>[] = [
  {
    accessorKey: "product.name",
    header: "Nombre",
  },
  {
    accessorKey: "product.type",
    header: "Tipo",
  },
  {
    accessorKey: "product.returns_date",
    header: "Dias para retornar",
  },
  {
    accessorKey: "price",
    header: "Precio",
  },
  {
    accessorKey: "day_week",
    header: "Lunes",
  },
] 