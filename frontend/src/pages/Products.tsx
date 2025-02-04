import { ProductTable } from "@/components/products/ProductTable";
import { Button } from "@/components/ui/button";
import { Product, ProductType } from "@/models/Product";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FileDown, Printer, Search, UserPlus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/api/Product.api";
import { debounce } from "lodash";
import printElement from "@/utils/printElement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Products = () => {
  const tableRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState("products");

  const [products, setProducts] = useState<Product[]>([]);
  const [newspapers, setNewspapers] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      const products = await getProducts(page, pageSize, ProductType.PRODUCT);
      setProducts(products.results);
      setTotalCount(products.count);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }, [page, pageSize]);

  const fetchNewspapers = useCallback(async () => {
    try {
      const newspapers = await getProducts(page, pageSize, ProductType.NEWSPAPER);
      setNewspapers(newspapers.results);
      setTotalCount(newspapers.count);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }, [page, pageSize]);

  // Debounce search
  const debouncedSearch = useMemo(
    () => debounce(async (productName: string) => {
      if (activeTab === "newspapers") {
        if (productName) {
          setIsSearching(true);
          try {
            const products = await getProducts(1, pageSize, ProductType.PRODUCT, productName);
            setProducts(products.results);
            setTotalCount(products.count);
            setPage(1);
          } catch (error) {
            if (error instanceof Error) {
              console.error(error.message);
            }
          }
          setIsSearching(false);
        } else {
          fetchProduct();
        }
      } else {
        if (productName) {
          setIsSearching(true);
          try {
            const newspapers = await getProducts(1, pageSize, ProductType.NEWSPAPER, productName);
            setNewspapers(newspapers.results);
            setTotalCount(newspapers.count);
            setPage(1);
          } catch (error) {
            if (error instanceof Error) {
              console.error(error.message);
            }
          }
          setIsSearching(false);
        } else {
          fetchNewspapers();
        }
      }
    }, 300),
    [pageSize, activeTab, fetchProduct, fetchNewspapers]
  );

  useEffect(() => {
    if (!searchTerm) {
      fetchProduct();
      fetchNewspapers();
    } else {
      debouncedSearch(searchTerm);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [page, pageSize, searchTerm, debouncedSearch, fetchProduct, fetchNewspapers]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setPage(1);
  };

  const handlePrint = () => {
    if (tableRef.current) {
      printElement(tableRef.current, "Reporte de Ventas");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Tabs defaultValue="products" className="mx-auto space-y-6" onValueChange={(value) => setActiveTab(value)}>
      <TabsList className="flex bg-gray-900 rounded-none py-7">
        <TabsTrigger value="products" className="px-5 text-lg data-[state=active]:text-black text-white">Productos</TabsTrigger>
        <TabsTrigger value="newspapers" className="px-5 text-lg data-[state=active]:text-black text-white">Periódicos</TabsTrigger>
      </TabsList>

      <TabsContent value="products" className="container space-y-5 mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-4xl font-bold">Productos</h1>
          {/* Export buttons */}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <FileDown className="w-4 h-4" />
              Exportar
            </Button>
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Imprimir
            </Button>
            <Button className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Nuevo producto
            </Button>
          </div>
        </div>
        {/* Search Bar */}
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
              <button
                onClick={clearSearch}
                className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
              >
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
        />
      </TabsContent>

      <TabsContent value="newspapers" className="container space-y-5 mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-4xl font-bold">Periodicos</h1>
          {/* Export buttons */}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <FileDown className="w-4 h-4" />
              Exportar
            </Button>
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Imprimir
            </Button>
            <Button className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Nuevo periodico
            </Button>
          </div>
        </div>
        {/* Search Bar */}
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
              <button
                onClick={clearSearch}
                className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
              >
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
          data={newspapers}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          tableRef={tableRef}
        />
      </TabsContent>

    </Tabs>
  );
}

export default Products;