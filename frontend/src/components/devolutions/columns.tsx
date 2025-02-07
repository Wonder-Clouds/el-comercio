import { Assignment, AssignmentStatus } from "@/models/Assignment";
import { Seller } from "@/models/Seller";
import { ColumnDef } from "@tanstack/react-table";
import EditableCell from './editable-cell';
import { Product, ProductType } from "@/models/Product";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";

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

        const quantity = detailAssignment?.quantity || 0;
        const returnedAmount = detailAssignment?.returned_amount || 0;
        const pendingAmount = quantity - returnedAmount;
        const totalToPay = pendingAmount * (detailAssignment?.unit_price || 0);

        const formatCurrency = (value: number) => {
          return typeof value === 'number' ? value.toFixed(2) : '0.00';
        };

        return (
          <>
            {detailAssignment?.quantity === 0 || detailAssignment?.quantity == null ? (
              <span className="text-gray-500 text-sm">No se le asignó nada</span>
            ) : (
              <Card className="w-full max-w-sm">
                <div className="p-4">
                  <div className="space-y-2">
                    {/* Product Information */}
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Precio unitario</p>
                        <p className="text-lg font-medium">
                          ${detailAssignment?.product?.type === ProductType.NEWSPAPER ? detailAssignment?.unit_price : detailAssignment?.product?.product_price || 0}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Quantities Section */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Asignados</p>
                        <p className="text-lg font-medium">{quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Devueltos</p>
                        <p className="text-lg font-medium">{returnedAmount}</p>
                      </div>
                    </div>

                    {/* Return Input Section */}
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Cantidad a devolver</p>
                      <EditableCell
                        value={0}
                        row={row}
                        column={{ id: `quantity_${product.id}` }}
                        onValueChange={(newValue) => {
                          onValueChange(assignment.id, detailAssignment?.id as number, product.id, newValue);
                        }}
                      />
                    </div>

                    {/* Total Section */}
                    <div className="bg-gray-50 p-2 rounded-lg mt-4">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-600">Total a pagar</p>
                        <p className="text-xl font-bold text-gray-900">
                          ${formatCurrency(totalToPay)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </>
        );
      }
    })),
  ];
};
