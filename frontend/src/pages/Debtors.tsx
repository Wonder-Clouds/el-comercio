import { useCallback, useEffect, useState } from "react";
import { getUnpaidSellers } from "@/api/Seller.api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, RefreshCw } from "lucide-react";
import { DetailAssignment } from "@/models/DetailAssignment";
import DebtorCard from "@/components/debtors/DebtorCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateDebtorsReport } from "@/utils/generatePdfs/generateDebtorsReport";

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
      setFilteredDebtors(filteredDebtors);
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
          (debtor.seller_code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (debtor.seller_dni || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      const statusBool = filterStatus === "ACTIVO";
      result = result.filter(debtor => debtor.seller_status === statusBool);
    }

    setFilteredDebtors(result);
  }, [searchTerm, filterStatus, debtors]);

  const handleRefresh = () => {
    fetchDebtors();
  };

  const calculateTotalDebt = () => {
    return filteredDebtors.reduce((total, debtor) => {
      const debtorTotal = debtor.assignments.reduce((debtorSum, assignment) => {
        const quantity = parseFloat(assignment.quantity?.toString() || "0");
        const unitPrice = parseFloat(assignment.unit_price?.toString() || "0");
        const returnedAmount = parseFloat(assignment.returned_amount?.toString() || "0");
        const debt = (quantity - returnedAmount) * unitPrice;
        return debtorSum + (debt > 0 ? debt : 0);
      }, 0);
      return total + debtorTotal;
    }, 0);
  };

  return (
    <div className="max-w-full lg:container mx-auto p-4">
      <Card className="bg-white shadow-lg border-0">
        <CardHeader className="flex justify-between  bg-gradient-to-r from-indigo-950 to-indigo-900 text-white rounded-t-lg p-6">
          <CardTitle className="text-3xl font-bold">
            Deudores
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col justify-between md:flex-row gap-4 w-full">
              <div className="relative w-full md:w-1/2">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar por nombre, código o DNI..."
                  className="pl-8 h-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <select
                  className="h-10 p-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-32"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value="INACTIVO">Inactivo</option>
                  <option value="ACTIVO">Activo</option>
                </select>

                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  className="h-10 px-4"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden md:inline ml-2">Actualizar</span>
                </Button>

                <Button onClick={() => generateDebtorsReport(filteredDebtors)} className="bg-blue-800 hover:bg-blue-900 font-semibold h-10 px-4">
                  <FileText className="h-4 w-4" />
                  <span className="hidden md:inline ml-2">Exportar</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 bg-gray-50 p-4 rounded-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <p className="text-gray-600">
                <span className="font-semibold">{filteredDebtors.length}</span> {filteredDebtors.length === 1 ? "deudor" : "deudores"} encontrados
              </p>
              <p className="text-gray-600">
                Deuda total: <span className="font-bold text-red-600">S/.{calculateTotalDebt().toFixed(2)}</span>
              </p>
            </div>
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
              {filteredDebtors.map((debtor, index) => (
                <DebtorCard key={debtor.seller_id} debtor={debtor} index={index} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Debtors;