import { columns } from "@/components/sellers/columns";
import { SellerTable } from "@/components/sellers/SellerTable.tsx";
import { useEffect, useRef, useState, useCallback } from "react";
import { getSellers } from "@/api/Seller.api.ts";
import { Button } from "@/components/ui/button";
import CreateCard from "@/components/sellers/SellersCreateCard.tsx";
import { Seller } from "@/models/Seller";
import { Input } from "@/components/ui/input";
import { Search, FileDown, Printer, UserPlus, X } from "lucide-react";
import debounce from 'lodash/debounce';

function Sellers() {
  const tableRef = useRef<HTMLDivElement>(null);
  
  const [data, setData] = useState<Seller[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // Debounce search
  const debouncedSearch = debounce(async (term: string) => {
    if (term) {
      setIsSearching(true);
      try {
        // Asumiendo que getSellers acepta un parámetro de búsqueda
        //const sellers = await getSellers(1, pageSize, term);
        const sellers = await getSellers(1, pageSize);
        setData(sellers.results);
        setTotalCount(sellers.count);
        setPage(1);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
      setIsSearching(false);
    } else {
      fetchData();
    }
  }, 300);

  const fetchData = useCallback(async () => {
    try {
      const sellers = await getSellers(page, pageSize);
      setData(sellers.results);
      setTotalCount(sellers.count);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }, [page, pageSize]);

  useEffect(() => {
    if (!searchTerm) {
      fetchData();
    } else {
      debouncedSearch(searchTerm);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [page, pageSize, searchTerm, debouncedSearch, fetchData]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setPage(1);
  };

  const handlePrint = () => {
    if (tableRef.current) {
      const printWindow = window.open("", "_blank")
      printWindow?.document.write(`
        <html>
          <head>
            <title>Imprimir Tabla</title>
            <style>
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid black; padding: 8px; text-align: left; }
              th { background-color: #f4f4f4; }
              .no-print { display: none; }
            </style>
          </head>
          <body>
            <h2>Reporte de Ventas</h2>
            ${tableRef.current.innerHTML}
          </body>
        </html>
      `)
      printWindow?.document.close()
      printWindow?.focus()
      printWindow?.print()
      printWindow?.close()
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  return (
    <>
      <div className="container mx-auto space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-4xl font-bold">Vendedores</h1>
          {/* Export buttons */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
              <FileDown className="w-4 h-4" />
              Exportar
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Imprimir
            </Button>
            <Button onClick={openModal} className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Crear vendedor
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 left-3 top-1/2" />
            <Input
              type="text"
              placeholder="Buscar vendedor por nombre, código o email..."
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

        <SellerTable
          columns={columns}
          data={data}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          tableRef={tableRef}
        />
      </div>

      {showModal && <CreateCard closeModal={closeModal} />}
    </>
  );
}

export default Sellers;