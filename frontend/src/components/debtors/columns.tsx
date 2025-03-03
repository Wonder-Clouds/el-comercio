import type { Seller } from "@/models/Seller"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

interface ColumnsProps {
  onDelete: (seller: Seller) => void
  onUpdate: (seller: Seller) => void
}

export const getColumns = ({ onDelete, onUpdate }: ColumnsProps): ColumnDef<Seller>[] => [
  {
    accessorKey: "seller_code",
    header: "Numero",
  },
  {
    accessorKey: "seller_name",
    header: "Nombre",
  },
  {
    accessorKey: "seller_last_name",
    header: "Apellido",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => <span>{row.original.status ? "Activo" : "Inactivo"}</span>,
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const seller = row.original
      return (
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={() => onUpdate(seller)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              onDelete(seller)
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  },
]

