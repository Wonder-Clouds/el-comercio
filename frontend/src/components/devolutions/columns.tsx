import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import EditableCell from "./editable-cell";
import { Product, ProductType } from "@/models/Product";
import api from "@/config/axios";
import { Assignment } from "@/models/Assignment";
import { DetailAssignment } from "@/models/DetailAssignment";

const toggleStatus = async (detailAssignmentId: number, isFinalized: boolean) => {
  try {
    const { data: detailAssignment } = await api.get(`/detail-assignments/${detailAssignmentId}`);

    const updatedDetailAssignment = {
      ...detailAssignment,
      status: isFinalized ? "FINISHED" : "PENDING",
    };

    await api.patch(`/detail-assignments/${detailAssignmentId}/`, updatedDetailAssignment);

    console.log(`Estado actualizado a ${updatedDetailAssignment.status}`);
  } catch (error) {
    console.error("Error al cambiar el estado:", error);
  }
};

// 📌 Nuevo componente funcional para la celda
interface StatusCellProps {
  assignment: Assignment;
  detailAssignment: DetailAssignment;
  product: Product;
  onValueChange: (assignmentId: number, detailAssignmentId: number, productId: number, value: number) => void;
}

const StatusCell: React.FC<StatusCellProps> = ({ assignment, detailAssignment, product, onValueChange }) => {
  const quantity = detailAssignment?.quantity || 0;
  const returnedAmount = detailAssignment?.returned_amount || 0;
  const pendingAmount = quantity - returnedAmount;
  const totalToPay = pendingAmount * (detailAssignment?.unit_price || 0);

  const formatCurrency = (value: number) => {
    return typeof value === 'number' ? value.toFixed(2) : '0.00';
  };

  const [isFinalized, setIsFinalized] = useState(detailAssignment?.status === "FINISHED");

  useEffect(() => {
    setIsFinalized(detailAssignment?.status === "FINISHED");
  }, [detailAssignment?.status]);

  const handleToggleStatus = async (checked: boolean) => {
    setIsFinalized(checked);
    try {
      await toggleStatus(detailAssignment.id, checked);
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      setIsFinalized(!checked); // Revertir en caso de error
    }
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
                    S/.{detailAssignment?.product?.type === ProductType.NEWSPAPER
                      ? detailAssignment?.unit_price
                      : detailAssignment?.product?.product_price || 0}
                  </p>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className={`text-sm font-medium ${isFinalized ? "text-green-600" : "text-red-600"}`}>
                    {isFinalized ? "Finalizado" : "Pendiente"}
                  </span>
                  <Switch className="mx-auto" checked={isFinalized} onCheckedChange={handleToggleStatus} />
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
                  row={{ original: assignment }}
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
                    S/.{formatCurrency(totalToPay)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

// 📌 Sección de columnas
export const columns = (
  products: Product[],
  onValueChange: (assignmentId: number, detailAssignmentId: number, productId: number, value: number) => void
) => {
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
        const detailAssignment = assignment.detail_assignments?.find((d) => d.product.id === product.id);

        return (
          <StatusCell
            assignment={assignment}
            detailAssignment={detailAssignment as DetailAssignment}
            product={product}
            onValueChange={onValueChange}
          />
        );
      },
    })),
  ];
};
