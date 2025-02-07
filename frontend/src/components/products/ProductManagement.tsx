import { Product, ProductType } from "@/models/Product";
import { Button } from "@/components/ui/button";
import { FileDown, Printer, Search, UserPlus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductTable } from "./product/ProductTable";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getProducts, deleteProduct } from "@/api/Product.api";
import { debounce } from "lodash";
import printElement from "@/utils/printElement";
import { useToast } from "@/hooks/use-toast";
import CreateProductCard from "./product/CreateProductCard";
import UpdateProductCard from "./product/UpdateProductCard";

function ProductManagement() {
  const tableRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Estados para los modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Función para obtener productos filtrando por type PRODUCT
  const fetchProduct = useCallback(async () => {
    try {
      const response = await getProducts(page, pageSize, ProductType.PRODUCT, searchTerm);
      setProducts(response.results);
      setTotalCount(response.count);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error al cargar los productos",
        variant: "destructive",
      });
    }
  }, [page, pageSize, searchTerm, toast]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Debounce Search
  const debouncedSearch = useMemo(
    () =>
      debounce(async (productName: string) => {
        if (productName) {
          setIsSearching(true);
          try {
            const response = await getProducts(1, pageSize, ProductType.PRODUCT, productName);
            setProducts(response.results);
            setTotalCount(response.count);
            setPage(1);
          } catch (error) {
            console.error(error);
          }
          setIsSearching(false);
        } else {
          fetchProduct();
        }
      }, 300),
    [pageSize, fetchProduct]
  );

  useEffect(() => {
    if (!searchTerm) {
      fetchProduct();
    } else {
      debouncedSearch(searchTerm);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch, fetchProduct]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setPage(1);
  };

  const handlePrint = () => {
    if (tableRef.current) {
      printElement(tableRef.current, "Reporte de Productos");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Funciones para editar y eliminar productos
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowUpdateModal(true);
  };

  const handleDelete = async (product: Product) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await deleteProduct(product.id);
        toast({
          title: "Éxito",
          description: "Producto eliminado exitosamente",
          variant: "default",
        });
        fetchProduct();
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
        toast({
          title: "Error",
          description: "Error al eliminar el producto",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-4xl font-bold">Productos</h1>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            Exportar
          </Button>
          <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Imprimir
          </Button>
          <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Nuevo producto
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 left-3 top-1/2" />
          <Input
            type="text"
            placeholder="Buscar producto por nombre"
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <button onClick={clearSearch} className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {isSearching && (
          <div className="absolute -translate-y-1/2 right-14 top-1/2">
            <div className="w-4 h-4 border-2 border-gray-300 rounded-full animate-spin border-t-gray-600" />
          </div>
        )}
      </div>

      <ProductTable
        data={products}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        tableRef={tableRef}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal de creación */}
      {showCreateModal && (
        <CreateProductCard closeModal={() => setShowCreateModal(false)} updateData={fetchProduct} />
      )}

      {/* Modal de actualización */}
      {showUpdateModal && selectedProduct && (
        <UpdateProductCard closeModal={() => setShowUpdateModal(false)} updateData={fetchProduct} productData={selectedProduct} />
      )}
    </>
  );
}

export default ProductManagement;
