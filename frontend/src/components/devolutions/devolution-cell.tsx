import { Assignment } from "@/models/Assignment";
import { DetailAssignment } from "@/models/DetailAssignment";
import { Item } from "@/models/Product";
import { Separator } from "@radix-ui/react-separator";
import EditableCell from "./editable-cell";
import { RotateCcw } from "lucide-react";
import { Card } from "../ui/card";
import { useEffect, useState } from "react";
import api from "@/config/axios";
import { refreshReturnedAmount } from "@/api/DetailAssignment.api";
import { Switch } from "../ui/switch";
import { Types } from "@/models/TypeProduct";

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

interface DevolutionCellProps {
  assignment: Assignment;
  detailAssignment: DetailAssignment;
  product: Item;
  onValueChange: (assignmentId: number, detailAssignmentId: number, productId: number, value: number) => void;
}

const DevolutionCell: React.FC<DevolutionCellProps> = ({ assignment, detailAssignment, product, onValueChange }) => {
  const [isFinalized, setIsFinalized] = useState(detailAssignment?.status === "FINISHED");

  const quantity = detailAssignment?.quantity || 0;
  const returnedAmount = detailAssignment?.returned_amount || 0;
  const pendingAmount = quantity - returnedAmount;
  const totalToPay = pendingAmount * (detailAssignment?.unit_price || 0);

  const formatCurrency = (value: number) => {
    return typeof value === 'number' ? value.toFixed(2) : '0.00';
  };

  const refreshDevolution = async () => {
    try {
      // resetDevolucion(assignment.id, detailAssignment.id, product.id);
      await refreshReturnedAmount(detailAssignment.id);

      onValueChange(assignment.id, detailAssignment.id, product.id, 0);

    } catch (error) {
      console.error("Error al borrar la devolución:", error);
    }
  };

  const handleToggleStatus = async (checked: boolean) => {
    setIsFinalized(checked);
    try {
      await toggleStatus(detailAssignment.id, checked);
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      setIsFinalized(!checked);
    }
  };

  useEffect(() => {
    setIsFinalized(detailAssignment?.status === "FINISHED");
  }, [detailAssignment?.status]);

  return (
    <>
      {detailAssignment?.quantity === 0 || detailAssignment?.quantity == null ? (
        <span className="text-gray-500 text-sm">Sin asignaciones</span>
      ) : (
        <Card className="w-full max-w-sm">
          <div className="p-4">
            <div className="space-y-2">
              {/* Product Information */}
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Precio unitario</p>
                  <p className="text-lg font-medium">
                    S/.{detailAssignment?.product?.type_product?.type === Types.NEWSPAPER
                      ? detailAssignment?.unit_price
                      : detailAssignment?.product?.product_price || 0}
                  </p>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className={`text-sm font-medium ${isFinalized ? "text-green-600" : "text-red-600"}`}>
                    {isFinalized ? "Pagado" : "Pendiente"}
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
                <div className="flex flex-row justify-between items-center text-gray-500">
                  <p className="text-sm text-gray-500">Cantidad a devolver</p>
                  <button onClick={refreshDevolution}>
                    <RotateCcw size={14} />
                  </button>
                </div>
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

export default DevolutionCell;