import Seller from "@/model/Seller"
import { ColumnDef } from "@tanstack/react-table"
import {Button} from "@/components/ui/button.tsx";
import {Pencil, Trash2} from "lucide-react";

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
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => console.log('Delete', row.original)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
      )
    },
  },
] 