import { useEffect, useState } from "react";
import { getProducts } from "@/api/Product.api";

const useProductsCount = () => {
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductsCount = async () => {
      try {
        const response = await getProducts(1, 1000);
        const activeProducts = response.results.filter((product) => product.status_product === true); 
        setTotalProducts(activeProducts.length);
      } catch (err) {
        console.error("Error al obtener productos:", err);
        setError("Error al obtener productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProductsCount();
  }, []);

  return { totalProducts, loading, error };
};

export default useProductsCount;
