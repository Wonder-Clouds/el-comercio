import { useCallback, useEffect, useState } from "react";
import { getUnpaidSellers } from "@/api/Seller.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/models/Product";

interface DebtorsProps {
  id: number;
  product: Product;
  quantity: number;
  returned_amount: number;
  unit_price: string;
  status: string;
  date_assignment: string;
  seller_name: string;
  seller_last_name: string;
  seller_code: string;
}

function Debtors() {
  const [debtors, setDebtors] = useState<DebtorsProps[]>([]);

  const fetchDebtors = useCallback(async () => {
    try {
      const debtors = await getUnpaidSellers();
      setDebtors(debtors);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }, []);

  useEffect(() => {
    fetchDebtors();
  }, [fetchDebtors]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {debtors.map((debtor) => (
        <Card key={debtor.id} className="shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle>{debtor.seller_name} {debtor.seller_last_name}</CardTitle>
            <p className="text-sm text-gray-500">Código: {debtor.seller_code}</p>
          </CardHeader>
          <CardContent>
              <div key={debtor.product.id} className="mb-2 p-2 border rounded-lg">
                <p className="font-semibold">{debtor.product.name}</p>
                <p className="text-sm text-gray-600">Cantidad: {debtor.quantity}</p>
                <p className="text-sm text-gray-600">Estado: {debtor.status == "PENDING" ? "Pendiente" : "Completo"}</p>
              </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default Debtors;
