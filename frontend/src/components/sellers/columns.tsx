import { Seller } from "@/models/Seller"
import { ColumnDef } from "@tanstack/react-table"
import {Button} from "@/components/ui/button.tsx";
import {Pencil, Trash2} from "lucide-react";

interface ColumnsProps {
  onDelete: (seller: Seller) => void;
}

export const getColumns = ({ onDelete }: ColumnsProps): ColumnDef<Seller>[] => [
  {
    accessorKey: "number_seller",
    header: "Numero",
  },
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
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      return (
          <div className="flex space-x-2">
            <Button
                variant="outline"
                size="icon"
                onClick={() => console.log('Update', row.original)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(row.original)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
      )
    },
  },
]