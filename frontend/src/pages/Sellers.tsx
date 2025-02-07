import { SellerTable } from "@/components/sellers/SellerTable"
import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import CreateCard from "@/components/sellers/SellersCreateCard"
import UpdateCard from "@/components/sellers/SellerUpdateCard"
import type { Seller } from "@/models/Seller"
import { Input } from "@/components/ui/input"
import { Search, FileDown, Printer, UserPlus, X } from "lucide-react"
import debounce from "lodash/debounce"
import printElement from "@/utils/printElement"
import { deleteSeller, getSellers } from "@/api/Seller.api"
import { getColumns } from "@/components/sellers/columns"
import { useToast } from "@/hooks/use-toast"

function Sellers() {
  const tableRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const [data, setData] = useState<Seller[]>([])

  // Pagination
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const openCreateModal = () => setShowCreateModal(true)
  const closeCreateModal = () => setShowCreateModal(false)
  const openUpdateModal = (seller: Seller) => {
    setSelectedSeller(seller)
    setShowUpdateModal(true)
  }
  const closeUpdateModal = () => {
    setSelectedSeller(null)
    setShowUpdateModal(false)
  }

  const fetchData = useCallback(async () => {
    try {
      const sellers = await getSellers(page, pageSize)
      setData(sellers.results)
      setTotalCount(sellers.count)
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
        toast({
          title: "Error",
          description: "Error al cargar los vendedores",
          variant: "destructive",
        })
      }
    }
  }, [page, pageSize, toast])

  const updateData = () => {
    fetchData()
  }

  const debouncedSearch = useMemo(
    () =>
      debounce(async (term: string) => {
        if (term) {
          setIsSearching(true)
          try {
            const sellers = await getSellers(1, pageSize, {
              search: term,
            })

            setData(sellers.results)
            setTotalCount(sellers.count)
            setPage(1)
          } catch (error) {
            if (error instanceof Error) {
              console.error(error.message)
              toast({
                title: "Error",
                description: "Error al buscar vendedores",
                variant: "destructive",
              })
            }
          }
          setIsSearching(false)
        } else {
          fetchData()
        }
      }, 300),
    [pageSize, fetchData, toast],
  )

  useEffect(() => {
    if (!searchTerm) {
      fetchData()
    } else {
      debouncedSearch(searchTerm)
    }
    return () => {
      debouncedSearch.cancel()
    }
  }, [searchTerm, debouncedSearch, fetchData])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setPage(1)
  }

  const handlePrint = () => {
    if (tableRef.current) {
      printElement(tableRef.current, "Reporte de Ventas")
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleDelete = async (seller: Seller) => {
    await deleteSeller(seller.id)
    toast({
      title: "Éxito",
      variant: "default",
      description: "Vendedor eliminado exitosamente",
    })
    fetchData()
  }

  const handleUpdate = (seller: Seller) => {
    openUpdateModal(seller)
  }

  const columns = getColumns({ onDelete: handleDelete, onUpdate: handleUpdate })

  return (
    <>
      <div className="container mx-auto mt-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-4xl font-bold">Vendedores</h1>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
              <FileDown className="w-4 h-4" />
              Exportar
            </Button>
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Imprimir
            </Button>
            <Button onClick={openCreateModal} className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Crear vendedor
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="relative">
            <Search className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 left-3 top-1/2" />
            <Input
              type="text"
              placeholder="Buscar vendedor por nombre, DNI, por codigo de vendedor"
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

      {showCreateModal && <CreateCard closeModal={closeCreateModal} updateData={updateData} />}

      {showUpdateModal && selectedSeller && (
        <UpdateCard closeModal={closeUpdateModal} updateData={updateData} sellerData={selectedSeller} />
      )}
    </>
  )
}

export default Sellers

