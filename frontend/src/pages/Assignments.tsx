import { useCallback, useEffect, useState } from "react";
import { getAssignments } from "@/api/Assignment.api";
import AssignmentTable from "@/components/assignments/AssignmentTable";
import { Assignment } from "@/models/Assignment";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Product, ProductType } from "@/models/Product";
import { getProducts } from "@/api/Product.api";
import capitalizeFirstLetter from "@/utils/capitalize";
import { Calendar } from "lucide-react";
import { formatDateToSpanishSafe } from "@/utils/formatDate";
import CalendarPicker from "@/components/shared/CalendarPicker";
import { getLocalDate } from "@/utils/getLocalDate";

function Assignments() {
  const [data, setData] = useState<Assignment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newspapers, setNewspapers] = useState<Product[]>([]);

  const [activeCalendar, setActiveCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchAssignments = useCallback(async () => {
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
      const today = getLocalDate();
      try {
        const assignments = await getAssignments(page, pageSize, today);
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
      setNewspapers(newspapers.results);
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
      setProducts(products.results);
      setTotalCount(products.count);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchAssignments();
    fetchNewspapers();
    fetchProducts();
  }, [fetchAssignments, fetchNewspapers, fetchProducts]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Tabs defaultValue="periodicos" className="mx-auto space-y-6 ">
      <TabsList className="flex bg-gray-900 rounded-none py-7">
        <TabsTrigger value="periodicos" className="px-5 text-lg data-[state=active]:text-black text-white">Periódicos</TabsTrigger>
        <TabsTrigger value="productos" className="px-5 text-lg data-[state=active]:text-black text-white">Productos</TabsTrigger>
      </TabsList>

      <TabsContent value="periodicos">
        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center space-x-5">
            <h1 className="text-4xl font-bold text-center">Periódicos</h1>
            <button onClick={() => setActiveCalendar(!activeCalendar)} className="flex items-center p-2 text-gray-700 rounded-xl hover:bg-gray-200">
              <Calendar className="w-8 h-8 text-gray-700" />
            </button>
          </div>
          {data.length > 0 && !activeCalendar ? (
            <span className="my-auto text-xl">{capitalizeFirstLetter(formatDateToSpanishSafe(data[0].date_assignment.toString()))}</span>
          ) : null}
        </div>
        {!activeCalendar ? (
          <div className="p-5 mx-auto">
            <AssignmentTable
              data={data}
              products={newspapers}
              page={page}
              pageSize={pageSize}
              totalCount={totalCount}
              onPageChange={handlePageChange} />
          </div>
        ) : (
          <CalendarPicker
            onDateSelect={setSelectedDate}
            changeStatusCalendar={() => setActiveCalendar(false)}
          />
        )}
      </TabsContent>

      <TabsContent value="productos">
        <div className="flex flex-col items-center space-y-3">
          <h1 className="text-4xl font-bold text-center">Productos</h1>
          {data.length > 0 ? (
            <span className="my-auto text-xl">{capitalizeFirstLetter(formatDateToSpanishSafe(data[0].date_assignment.toString()))}</span>
          ) : null}
        </div>
        <div className="p-5 mx-auto">
          <AssignmentTable
            data={data}
            products={products}
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={handlePageChange} />
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default Assignments;
