import { useCallback, useEffect, useState } from "react";
import { getUnpaidSellers } from "@/api/Seller.api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, FileText } from "lucide-react";
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

function Debtors() {
  const [debtors, setDebtors] = useState<DebtorsProps[]>([]);
  const [filteredDebtors, setFilteredDebtors] = useState<DebtorsProps[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchDebtors = useCallback(async () => {
    setIsLoading(true);
    try {
      const debtorsData = await getUnpaidSellers();
      const filteredDebtors = debtorsData.filter((debtor: DebtorsProps) =>
        Array.isArray(debtor.assignments) && debtor.assignments.length > 0
      );
      setDebtors(filteredDebtors);
      setFilteredDebtors(debtorsData);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDebtors();
  }, [fetchDebtors]);

  useEffect(() => {
    let result = debtors;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        debtor =>
          (debtor.seller_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (debtor.seller_code || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      const statusBool = filterStatus === "ACTIVO";
      result = result.filter(debtor => debtor.seller_status === statusBool);
    }

    setFilteredDebtors(result);
  }, [searchTerm, filterStatus, debtors]);

  const calculateTotalDebt = (debtor: DebtorsProps): string => {
    if (!debtor || !debtor.assignments || debtor.assignments.length === 0) return "0.00";

    const totalDebt = debtor.assignments.reduce((total, assignment) => {
      const quantity = parseFloat(assignment.quantity?.toString() || "0");
      const unitPrice = parseFloat(assignment.unit_price?.toString() || "0");
      const returnedAmount = parseFloat(assignment.returned_amount?.toString() || "0");
      const debt = (quantity - returnedAmount) * unitPrice;

      return total + (debt > 0 ? debt : 0); // Asegura que no se reste de más
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

  const handleRefresh = () => {
    fetchDebtors();
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Deudores</h1>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar deudor..."
              className="pl-8 h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="h-10 p-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-32"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="INACTIVO">Inactivo</option>
            <option value="ACTIVO">Activo</option>
          </select>

          <Button className="h-10 gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Exportar</span>
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-gray-500">
          {filteredDebtors.length} {filteredDebtors.length === 1 ? "deudor" : "deudores"} encontrados
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredDebtors.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500 text-lg">No se encontraron deudores</p>
          <Button onClick={handleRefresh} variant="outline" className="mt-4">
            Actualizar datos
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDebtors.map((debtor, key) => (
            <Card key={key} className="shadow-lg border border-gray-200 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{debtor.seller_name || ''}</CardTitle>
                    <p className="text-sm text-gray-500">Código: {debtor.seller_code || 'N/A'}</p>
                  </div>
                  {getStatusBadge(debtor.seller_status)}
                </div>
              </CardHeader>

              <CardContent className="pb-2">
                <div className="space-y-2">
                  {debtor.assignments && debtor.assignments.length > 0 && (
                    debtor.assignments.map((assignment, index) => (
                      <div key={index} className="p-3 bg-gray-100 rounded-lg space-y-2">
                        <h3 className="font-semibold">{assignment.product.name && assignment.product.name ? assignment.product.name : "Producto sin nombre"}</h3>
                        <div className="grid grid-cols-2 gap-1 mt-1 text-sm">
                          <p>Cantidad: <span className="font-medium">{assignment.quantity || 0}</span></p>
                          <p>Devuelto: <span className="font-medium">{assignment.returned_amount || 0}</span></p>
                          <p>Precio/u: <span className="font-medium">S/.{assignment.unit_price || 0}</span></p>
                          <p>Pendiente: <span className="font-medium">{(assignment.quantity || 0) - (assignment.returned_amount || 0)}</span></p>
                          <p>Fecha asignación: <span className="font-medium">{formatDate(assignment.date_assignment)} </span></p>
                          <p>Fecha devolución: <span className="font-medium">{formatDate(assignment.return_date)} </span></p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>

              <CardFooter className="bg-gray-50 border-t">
                <div className="flex justify-between items-center w-full pt-3">
                  <p className="text-sm">Deuda total:</p>
                  <p className="font-bold text-lg">${calculateTotalDebt(debtor)}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Debtors;