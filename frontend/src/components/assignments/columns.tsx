import { Assignment, AssignmentStatus } from "@/models/Assignment";
import { Seller } from "@/models/Seller";
import { ColumnDef } from "@tanstack/react-table";
import EditableCell from './editable-cell';
import { Product } from "@/models/Product";

// Definición correcta del tipo para columnas editables
export type EditableColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  editable?: boolean;
};

export const columns = (
  products: Product[],
  onValueChange: (assignmentId: number, productId: number, value: number) => void
): EditableColumnDef<Assignment, Seller | Date | AssignmentStatus | number>[] => {
  return [
    {
      id: "number_seller",
      accessorKey: "seller.number_seller",
      header: "Código",
      editable: false,
    },
    {
      id: "name",
      accessorKey: "seller.name",
      header: "Nombre",
      editable: false,
    },
    {
      id: "last_name",
      accessorKey: "seller.last_name",
      header: "Apellido",
      editable: false,
    },
    ...products.map((product) => ({
      id: `quantity_${product.id}`,
      accessorKey: `detail_assignments.${product.id}.quantity`,
      header: product.name,
      editable: true,
      cell: ({ row }: { row: { original: Assignment } }) => {
        const assignment = row.original;
        const detailAssignment = assignment.detail_assignments?.find(
          (d) => d.product.id === product.id
        );
        const value = detailAssignment?.quantity || 0;

        return (
          <EditableCell
            value={value}
            row={row}
            column={{ id: `quantity_${product.id}` }}
            onValueChange={(newValue) => {
              onValueChange(assignment.id, product.id, newValue);
            }}
          />
        );
      },
    })),
  ];
};
