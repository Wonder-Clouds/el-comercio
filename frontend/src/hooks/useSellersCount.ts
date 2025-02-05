import { useEffect, useState } from "react";
import { getSellers } from "@/api/Seller.api";

const useSellersCount = () => {
  const [totalSellers, setTotalSellers] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSellersCount = async () => {
      try {
        const response = await getSellers(1, 1000); // Obtén una cantidad grande de vendedores
        const activeSellers = response.results.filter((seller) => seller.status === true); // Filtra los activos
        setTotalSellers(activeSellers.length);
      } catch (err) {
        console.error("Error al obtener vendedores:", err);
        setError("Error al obtener vendedores");
      } finally {
        setLoading(false);
      }
    };

    fetchSellersCount();
  }, []);

  return { totalSellers, loading, error };
};

export default useSellersCount;
