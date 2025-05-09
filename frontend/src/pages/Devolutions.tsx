import { useCallback, useEffect, useState } from "react";
import { getAssignments } from "@/api/Assignment.api";
import { Assignment } from "@/models/Assignment";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Product, ProductType } from "@/models/Product";
import { getProducts } from "@/api/Product.api";
import capitalizeFirstLetter from "@/utils/capitalize";
import DevolutionTable from "@/components/devolutions/DevolutionsTable";
import { formatDateToSpanishSafe } from "@/utils/formatDate";
import { getLocalDate } from "@/utils/getLocalDate";
import CalendarPicker from "@/components/shared/CalendarPicker";
import { Calendar } from "lucide-react";

function Devolutions() {
  const [data, setData] = useState<Assignment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newspapers, setNewspapers] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const [activeCalendar, setActiveCalendar] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>('');

  const fetchData = useCallback(async () => {
    if (selectedDate) {
      try {
        const assignments = await getAssignments(page, pageSize, selectedDate, selectedDate);
        setData(assignments.results);
        setTotalCount(assignments.count);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    } else {
      const yesterday = getLocalDate(-1);
      try {
        const assignments = await getAssignments(page, pageSize, yesterday);
        setData(assignments.results);
        setTotalCount(assignments.count);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }
  }, [page, pageSize, selectedDate]);

  const fetchNewspapers = useCallback(async () => {
    try {
      const newspapers = await getProducts(page, pageSize, ProductType.NEWSPAPER);
      setNewspapers(newspapers.results.filter((item): item is Product => 'product_price' in item));
      setTotalCount(newspapers.count);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }, [page, pageSize]);

  const fetchProducts = useCallback(async () => {
    try {
      const products = await getProducts(page, pageSize, ProductType.PRODUCT);
      setProducts(products.results.filter((item): item is Product => 'product_price' in item));
      setTotalCount(products.count);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchData();
    fetchNewspapers();
    fetchProducts();
  }, [fetchData, fetchNewspapers, fetchProducts]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Tabs defaultValue="periodicos" className="mx-auto space-y-6">
      <TabsList className="flex bg-gray-900 rounded-none py-7">
        <TabsTrigger value="periodicos" className="px-5 text-lg data-[state=active]:text-black text-white">Periódicos</TabsTrigger>
        <TabsTrigger value="productos" className="px-5 text-lg data-[state=active]:text-black text-white">Productos</TabsTrigger>
      </TabsList>

      <TabsContent value="periodicos">
        <div className="flex flex-row w-full mx-auto justify-center items-center">
          <div className="flex flex-col space-y-3">
            <h1 className="text-4xl font-bold text-center">Devoluciones de Periodicos</h1>
            {data.length > 0 ? (
              <span className="my-auto text-xl text-center">{capitalizeFirstLetter(formatDateToSpanishSafe(getLocalDate(-1)))}</span>
            ) : <span className="my-auto text-xl text-center">Selecciona la fecha cuando asignaron un producto</span>}
          </div>
          <button
            onClick={() => setActiveCalendar(!activeCalendar)}
            className="flex m-5 p-2 items-center text-gray-700 rounded-xl hover:bg-gray-200"
          >
            <Calendar className="w-14 h-14 text-gray-700" />
          </button>
        </div>

        <div className="mx-auto">
          {!activeCalendar ? (
            data.length > 0 ? (
              <div className="p-5 mx-auto">
                <DevolutionTable
                  data={data}
                  products={newspapers}
                  page={page}
                  pageSize={pageSize}
                  totalCount={totalCount}
                  onPageChange={handlePageChange}
                  refreshData={fetchData}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-5 text-xl text-gray-500">
                <p>No hay entregas disponibles para esta fecha.</p>
              </div>
            )
          ) : (
            <CalendarPicker
              onDateSelect={setSelectedDate}
              changeStatusCalendar={() => setActiveCalendar(false)}
            />
          )}

        </div>
      </TabsContent>

      <TabsContent value="productos">
        <div className="flex flex-row w-full mx-auto justify-center items-center">
          <div className="flex flex-col space-y-3">
            <h1 className="text-4xl font-bold text-center">Devoluciones de Productos</h1>
            {data.length > 0 && selectedDate ? (
              <span className="my-auto text-xl text-center">{capitalizeFirstLetter(formatDateToSpanishSafe(selectedDate as string))}</span>
            ) : <span className="my-auto text-xl text-center">Selecciona la fecha cuando asignaron un producto</span>}
          </div>
          <button
            onClick={() => setActiveCalendar(!activeCalendar)}
            className="flex m-5 p-2 items-center text-gray-700 rounded-xl hover:bg-gray-200"
          >
            <Calendar className="w-14 h-14 text-gray-700" />
          </button>
        </div>
        <div className="mx-auto">
          {!activeCalendar ? (
            data.length > 0 ? (
              <div className="p-5 mx-auto">
                <DevolutionTable
                  data={data}
                  products={products}
                  page={page}
                  pageSize={pageSize}
                  totalCount={totalCount}
                  onPageChange={handlePageChange}
                  refreshData={fetchData}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-5 text-xl text-gray-500">
                <p>No hay entregas disponibles para esta fecha.</p>
              </div>
            )
          ) : (
            <CalendarPicker
              onDateSelect={setSelectedDate}
              changeStatusCalendar={() => setActiveCalendar(false)}
            />
          )}

        </div>
      </TabsContent>

    </Tabs>
  );
}

export default Devolutions;