import { Product } from "@/models/Product"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Nombre"
  },
  {
    accessorKey: "type",
    header: "Tipo"
  },
  {
    accessorKey: "returns_date",
    header: "Dias de devolucion"
  },
  {
    accessorKey: "monday_price",
    header: "Lunes",
    cell: ({ getValue }) => `S/. ${getValue()}`
  },
  {
    accessorKey: "tuesday_price",
    header: "Martes",
    cell: ({ getValue }) => `S/. ${getValue()}`
  },
  {
    accessorKey: "wednesday_price",
    header: "Miercoles",
    cell: ({ getValue }) => `S/. ${getValue()}`
  },
  {
    accessorKey: "thursday_price",
    header: "Jueves",
    cell: ({ getValue }) => `S/. ${getValue()}`
  },
  {
    accessorKey: "friday_price",
    header: "viernes",
    cell: ({ getValue }) => `S/. ${getValue()}`
  },
] 