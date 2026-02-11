import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import { ItemTable } from "@/components/items/ItemTable";
import ItemsModal from "@/components/items/ItemsModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Item } from "@/models/Product";
import { Types } from "@/models/TypeProduct";
import { FileDown, Plus, Search, X } from "lucide-react";
import { debounce } from "lodash";
import { getItems } from "@/api/Product.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ItemsUpdate from "@/components/items/ItemsUpdate";

const Items = () => {
  const { type } = useParams();
  const itemType = type === "productos" ? Types.PRODUCT : Types.NEWSPAPER;

  const pageTitle = itemType === Types.PRODUCT ? "Productos" : "Periódicos";

  const tableRef = useRef<HTMLDivElement>(null);

  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      const response = await getItems(page, pageSize, itemType);
      setItems(response.results);
      setTotalCount(response.count);
    } catch (error) {
      console.error(error);
    }
  }, [page, itemType, pageSize]);

  const openUpdateModal = (item: Item) => {
    setSelectedItem(item);
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setSelectedItem(null);
    setShowUpdateModal(false)
  }

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
    <div className="max-w-full lg:container mx-auto p-4">
      <Card className="bg-white shadow-lg border-0">
        <CardHeader className="bg-primary text-white rounded-t-lg p-6">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold">
              {pageTitle}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="container space-y-5 mx-auto">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                  Agregar nuevo
                </Button>
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
                  placeholder={`Buscar ${pageTitle.toLowerCase()} por nombre...`}
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
              onEdit={openUpdateModal}
              onPageChange={handlePageChange}
              tableRef={tableRef}
            />
          </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <ItemsModal
          type={itemType}
          closeModal={() => setIsModalOpen(false)}
          updateData={fetchItems}
        />
      )}

      {showUpdateModal && selectedItem && (
        <ItemsUpdate
          closeModal={closeUpdateModal}
          updateData={fetchItems}
          item={selectedItem}
        />
      )}
    </div>
  )
}

export default Items;