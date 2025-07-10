import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import { ItemTable } from "@/components/items/ItemTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Item } from "@/models/Product";
import { Types } from "@/models/TypeProduct";
import { FileDown, Search, X } from "lucide-react";
import { debounce } from "lodash";
import { getItems } from "@/api/Product.api";

const Items = () => {
  const { type } = useParams();
  const itemType = type === "productos" ? Types.PRODUCT : Types.NEWSPAPER;

  const pageTitle = itemType === Types.PRODUCT ? "PRODUCTOS" : "PERIÓDICOS";

  const tableRef = useRef<HTMLDivElement>(null);

  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const response = await getItems(page, pageSize, itemType);
      setItems(response.results);
      setTotalCount(response.count);
    } catch (error) {
      console.error(error);
    }
  }, [page, itemType, pageSize]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (newspaperName: string) => {
        if (newspaperName) {
          setIsSearching(true);
          try {
            const response = await getItems(1, pageSize, itemType, newspaperName);
            setItems(response.results);
            setTotalCount(response.count);
            setPage(1);
          } catch (error) {
            console.error(error);
          }
          setIsSearching(false);
        } else {
          fetchItems();
        }
      }, 300),
    [pageSize, itemType, fetchItems]
  );

  useEffect(() => {
    if (!searchTerm) {
      fetchItems();
    } else {
      debouncedSearch(searchTerm);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [page, pageSize, searchTerm, debouncedSearch, fetchItems]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="container space-y-5 mx-auto py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-4xl font-bold">{pageTitle}</h1>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            Exportar
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

      <ItemTable
        data={items}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        tableRef={tableRef}
      />
    </div>
  )
}

export default Items;