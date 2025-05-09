// src/components/products/newspaper/NewspaperManagement.tsx
import { FileDown, Printer, Search, UserPlus, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Newspaper, ProductType } from "@/models/Product";
import printElement from "@/utils/printElement";
import { deleteProduct, getNewspapers } from "@/api/Product.api";
import { debounce } from "lodash";
import { NewspaperTable } from "./newspaper/NewspaperTable";
import CreateNewspaperCard from "./newspaper/CreateNewspaperCard";
import UpdateNewspaperCard from "./newspaper/UpdateNewspaperCard";
import { useToast } from "@/hooks/use-toast";

function NewspaperManagement() {
  const tableRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [newspapers, setNewspapers] = useState<Newspaper[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Newspaper | null>(null);

  const fetchNewspapers = useCallback(async () => {
    try {
      const response = await getNewspapers(page, pageSize, ProductType.NEWSPAPER);
      setNewspapers(response.results);
      setTotalCount(response.count);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error al cargar los periódicos",
        variant: "destructive",
      });
    }
  }, [page, pageSize, toast]);

  useEffect(() => {
    fetchNewspapers();
  }, [fetchNewspapers]);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (term: string) => {
        if (term) {
          setIsSearching(true);
          try {
            const response = await getNewspapers(1, pageSize, ProductType.NEWSPAPER);
            setNewspapers(response.results);
            setTotalCount(response.count);
            setPage(1);
          } catch (error) {
            console.error(error);
          }
          setIsSearching(false);
        } else {
          fetchNewspapers();
        }
      }, 300),
    [pageSize, fetchNewspapers]
  );

  useEffect(() => {
    if (!searchTerm) {
      fetchNewspapers();
    } else {
      debouncedSearch(searchTerm);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [page, pageSize, searchTerm, debouncedSearch, fetchNewspapers]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setPage(1);
  };

  const handlePrint = () => {
    if (tableRef.current) {
      printElement(tableRef.current, "Reporte de Periódicos");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Función para abrir el modal de actualización
  const handleEdit = (product: Newspaper) => {
    setSelectedProduct(product);
    setShowUpdateModal(true);
  };

  const handleDelete = async (product: Newspaper) => {
    if (confirm("¿Estás seguro de eliminar este periódico?")) {
      try {
        await deleteProduct(product.id);
        toast({
          title: "Éxito",
          description: "Periódico eliminado exitosamente",
          variant: "default",
        });
        fetchNewspapers();
      } catch (error) {
        console.error("Error al eliminar el periódico:", error);
        toast({
          title: "Error",
          description: "Error al eliminar el periódico",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-4xl font-bold">Periódicos</h1>
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
            Nuevo periódico
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 left-3 top-1/2" />
          <Input
            type="text"
            placeholder="Buscar periódico por nombre"
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

      <NewspaperTable
        data={newspapers}
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
        <CreateNewspaperCard closeModal={() => setShowCreateModal(false)} updateData={fetchNewspapers} />
      )}

      {/* Modal de actualización */}
      {showUpdateModal && selectedProduct && (
        <UpdateNewspaperCard
          closeModal={() => setShowUpdateModal(false)}
          updateData={fetchNewspapers}
          productData={selectedProduct}
        />
      )}
    </>
  );
}

export default NewspaperManagement;
