import { AssignmentStatus } from "@/models/Assignment"
import { DetailAssignment } from "@/models/DetailAssignment";
import { Seller } from "@/models/Seller";
import { ColumnDef } from "@tanstack/react-table"

type EditableColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  editable?: boolean;
}

export const columns: EditableColumnDef<DetailAssignment, Seller | Date | AssignmentStatus>[] = [
  // {
  //   accessorKey: "assignment.date_assignment",
  //   header: "Fecha de asignación",
  //   editable: false,
  //   cell: ({ getValue }) => {
  //     const date = getValue() as Date;
  //     return new Date(date).toLocaleDateString();
  //   }
  // },
  {
    accessorKey: "assignment.seller.number_seller",
    header: "Codigo",
    editable: false,
  },
  {
    accessorKey: "assignment.seller.name",
    header: "Nombre",
    editable: false,
  },
  {
    accessorKey: "assignment.seller.last_name",
    header: "Apellido",
    editable: false,
  },
  {
    accessorKey: "product.name",
    header: "Producto",
    editable: false,
  },
  {
    accessorKey: "quantity",
    header: "Cantidad entregada",
    editable: true,
  }
]