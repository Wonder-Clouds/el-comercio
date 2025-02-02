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
  onValueChange: (assignmentId: number, detailAssignmentId: number, productId: number, value: number) => void
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
        return (
          <>
            {detailAssignment?.quantity === 0 || detailAssignment?.quantity == null ? (
              <span className="text-gray-500 text-sm">No se le asignó nada</span>
            ) : (
              <div className="flex flex-col space-y-1 p-2 border rounded-lg">
                <span className="text-gray-700 font-semibold">
                  Cantidad asignada: {detailAssignment?.quantity}
                </span>
                  <span className="text-gray-700 font-semibold">
                    Cantidad devuelta: {detailAssignment?.returned_amount}
                  </span>
                <span className="text-gray-500 text-sm">Cantidad que va devolver:</span>
                <EditableCell
                  value={0}
                  row={row}
                  column={{ id: `quantity_${product.id}` }}
                  onValueChange={(newValue) => {
                    onValueChange(assignment.id, detailAssignment?.id as number, product.id, newValue);
                  }}
                />
              </div>
            )}
          </>
        );
      }
    })),
  ];
};
