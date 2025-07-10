import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DetailAssignment } from "@/models/DetailAssignment";

interface DebtorsProps {
  seller_id: number;
  seller_name: string;
  seller_code: string;
  seller_phone: string;
  seller_dni: string;
  seller_status: boolean;
  assignments: DetailAssignment[];
}

interface DebtorCardProps {
  debtor: DebtorsProps;
  index: number;
}

function DebtorCard({ debtor, index }: DebtorCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllAssignments, setShowAllAssignments] = useState(false);

  const calculateTotalDebt = (debtor: DebtorsProps): string => {
    if (!debtor || !debtor.assignments || debtor.assignments.length === 0) return "0.00";

    const totalDebt = debtor.assignments.reduce((total, assignment) => {
      const quantity = parseFloat(assignment.quantity?.toString() || "0");
      const unitPrice = parseFloat(assignment.unit_price?.toString() || "0");
      const returnedAmount = parseFloat(assignment.returned_amount?.toString() || "0");
      const debt = (quantity - returnedAmount) * unitPrice;

      return total + (debt > 0 ? debt : 0);
    }, 0);

    return totalDebt.toFixed(2);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No disponible";

    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: boolean) => {
    if (!status) {
      return <Badge className="bg-red-500 hover:bg-red-400">Inactivo</Badge>;
    } else {
      return <Badge className="bg-green-500 hover:bg-green-400">Activo</Badge>;
    }
  };

  const maxVisibleAssignments = 2;
  const hasMoreAssignments = debtor.assignments && debtor.assignments.length > maxVisibleAssignments;
  const visibleAssignments = showAllAssignments
    ? debtor.assignments
    : debtor.assignments?.slice(0, maxVisibleAssignments) || [];

  return (
    <Card key={index} className="shadow-lg border border-gray-200 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{debtor.seller_name || ''}</CardTitle>
            <p className="text-sm text-gray-500">Código: {debtor.seller_code || 'N/A'}</p>
            <p className="text-sm text-gray-500">DNI: {debtor.seller_dni || 'N/A'}</p>
            <p className="text-sm text-gray-500">Teléfono: {debtor.seller_phone || 'N/A'}</p>
          </div>
          {getStatusBadge(debtor.seller_status)}
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="space-y-2">
          {debtor.assignments && debtor.assignments.length > 0 && (
            <>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm">
                  Asignaciones ({debtor.assignments.length})
                </h3>
                {hasMoreAssignments && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllAssignments(!showAllAssignments)}
                    className="h-6 px-2 text-xs"
                  >
                    {showAllAssignments ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Menos
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        Ver todas
                      </>
                    )}
                  </Button>
                )}
              </div>

              {visibleAssignments.map((assignment, assignmentIndex) => (
                <div key={assignmentIndex} className="p-3 bg-gray-100 rounded-lg space-y-2">
                  <h4 className="font-semibold text-sm">
                    {assignment.product.name && assignment.product.name ? assignment.product.name : "Producto sin nombre"}
                  </h4>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <p>Cantidad: <span className="font-medium">{assignment.quantity || 0}</span></p>
                    <p>Devuelto: <span className="font-medium">{assignment.returned_amount || 0}</span></p>
                    <p>Precio/u: <span className="font-medium">S/.{assignment.unit_price || 0}</span></p>
                    <p>Pendiente: <span className="font-medium">{(assignment.quantity || 0) - (assignment.returned_amount || 0)}</span></p>
                  </div>

                  {/* Botón para expandir detalles adicionales */}
                  {!isExpanded && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsExpanded(true)}
                      className="h-6 px-2 text-xs w-full"
                    >
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Ver fechas
                    </Button>
                  )}

                  {isExpanded && (
                    <div className="space-y-1 pt-2 border-t border-gray-200">
                      <div className="grid grid-cols-1 gap-1 text-xs">
                        <p>Fecha asignación: <span className="font-medium">{formatDate(assignment.date_assignment)}</span></p>
                        <p>Fecha devolución: <span className="font-medium">{formatDate(assignment.return_date)}</span></p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(false)}
                        className="h-6 px-2 text-xs w-full"
                      >
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Ocultar fechas
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              {hasMoreAssignments && !showAllAssignments && (
                <div className="text-center py-2">
                  <p className="text-xs text-gray-500">
                    +{debtor.assignments.length - maxVisibleAssignments} asignaciones más
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50 border-t">
        <div className="flex justify-between items-center w-full pt-3">
          <p className="text-sm">Deuda total:</p>
          <p className="font-bold text-lg text-red-600">S/.{calculateTotalDebt(debtor)}</p>
        </div>
      </CardFooter>
    </Card>
  );
}

export default DebtorCard;