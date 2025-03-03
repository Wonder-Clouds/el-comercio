import { useCallback, useEffect, useRef, useState } from "react";
import { getAssignments, postAllAssignments } from "@/api/Assignment.api";
import AssignmentTable from "@/components/assignments/AssignmentTable";
import { Assignment } from "@/models/Assignment";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Product, ProductType } from "@/models/Product";
import { getProducts } from "@/api/Product.api";
import capitalizeFirstLetter from "@/utils/capitalize";
import { Calendar, FileDown, Printer, RotateCcw } from "lucide-react";
import { formatDateToSpanishSafe } from "@/utils/formatDate";
import CalendarPicker from "@/components/shared/CalendarPicker";
import { getLocalDate } from "@/utils/getLocalDate";
import { Button } from "@/components/ui/button";
import printElement from "@/utils/printElement";

function Assignments() {
  // Refs para cada sección
  const tableRefNewspapers = useRef<HTMLDivElement>(null);
  const tableRefProducts = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<Assignment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newspapers, setNewspapers] = useState<Product[]>([]);

  const [activeCalendar, setActiveCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(getLocalDate());

  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
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

  const handleCreateAssignments = async () => {
    try {
      await postAllAssignments();
      fetchAssignments();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  // Funciones de impresión para cada tabla:
  const handlePrintNewspapers = () => {
    if (tableRefNewspapers.current) {
      const clone = tableRefNewspapers.current.cloneNode(true) as HTMLElement;
      clone.querySelectorAll(".action-column").forEach((el) => el.remove());
      printElement(clone, "Reporte de Periódicos");
    }
  };

  const handlePrintProducts = () => {
    if (tableRefProducts.current) {
      const clone = tableRefProducts.current.cloneNode(true) as HTMLElement;
      clone.querySelectorAll(".action-column").forEach((el) => el.remove());
      printElement(clone, "Reporte de Productos");
    }
  };

  return (
    <Tabs defaultValue="periodicos" className="mx-auto space-y-6">
      <TabsList className="flex bg-gray-900 rounded-none py-7">
        <TabsTrigger
          value="periodicos"
          className="px-5 text-lg data-[state=active]:text-black text-white"
        >
          Periódicos
        </TabsTrigger>
        <TabsTrigger
          value="productos"
          className="px-5 text-lg data-[state=active]:text-black text-white"
        >
          Productos
        </TabsTrigger>
      </TabsList>

      {/* Pestaña de Periódicos */}
      <TabsContent value="periodicos">
        <div className="flex flex-col items-center space-y-3">
          <div className="flex flex-col items-center space-y-5">
            <h1 className="text-4xl font-bold text-center">Asignar Periódicos</h1>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handlePrintNewspapers}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FileDown className="w-4 h-4" />
                Exportar
              </Button>
              <Button
                onClick={handlePrintNewspapers}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimir
              </Button>
              {/** Si ya existen asignaciones o la fecha seleccionada no es la actual,
               * se muestra el botón "Asignar" en el encabezado.
               */}
              {(data.length > 0 || selectedDate !== getLocalDate()) && (
                <Button
                  onClick={handleCreateAssignments}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Refrescar
                </Button>
              )}
              <button
                onClick={() => setActiveCalendar(!activeCalendar)}
                className="flex items-center text-gray-700 rounded-xl hover:bg-gray-200"
              >
                <Calendar className="w-8 h-8 text-gray-700" />
              </button>
            </div>

          </div>
          <span className="my-auto text-xl">
            {capitalizeFirstLetter(formatDateToSpanishSafe(selectedDate as string))}
          </span>
        </div>
        {/** Si no hay registros y la fecha es la actual, mostramos el botón grande "Asignar periódicos para hoy" */}
        {data.length === 0 && selectedDate === getLocalDate() && (
          <button
            onClick={handleCreateAssignments}
            className="flex py-4 px-8 mx-auto my-5 text-white bg-blue-900 hover:bg-blue-950 text-2xl font-bold rounded-xl shadow-lg transition-all duration-300"
          >
            Asignar periódicos para hoy
          </button>
        )}
        {!activeCalendar ? (
          data.length > 0 ? (
            <div className="p-5 mx-auto">
              <AssignmentTable
                data={data}
                products={newspapers}
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={handlePageChange}
                tableRef={tableRefNewspapers}
                tableType="newspaper"
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
      </TabsContent>

      {/* Pestaña de Productos */}
      <TabsContent value="productos">
        <div className="flex flex-col items-center space-y-3">
          <h1 className="text-4xl font-bold text-center">Productos</h1>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handlePrintProducts}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              Exportar
            </Button>
            <Button
              onClick={handlePrintProducts}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </Button>
            {/** Si ya existen asignaciones o la fecha seleccionada no es la actual,
               * se muestra el botón "Asignar" en el encabezado.
               */}
            {(data.length > 0 || selectedDate !== getLocalDate()) && (
              <Button
                onClick={handleCreateAssignments}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Refrescar
              </Button>
            )}
            <button
              onClick={() => setActiveCalendar(!activeCalendar)}
              className="flex items-center text-gray-700 rounded-xl hover:bg-gray-200"
            >
              <Calendar className="w-8 h-8 text-gray-700" />
            </button>
          </div>

          {data.length > 0 && (
            <span className="my-auto text-xl">
              {capitalizeFirstLetter(formatDateToSpanishSafe(data[0].date_assignment.toString()))}
            </span>
          )}
        </div>
        {/** Si no hay registros y la fecha es la actual, mostramos el botón grande "Asignar periódicos para hoy" */}
        {data.length === 0 && selectedDate === getLocalDate() && (
          <button
            onClick={handleCreateAssignments}
            className="flex py-4 px-8 mx-auto my-5 text-white bg-blue-900 hover:bg-blue-950 text-2xl font-bold rounded-xl shadow-lg transition-all duration-300"
          >
            Asignar productos para hoy
          </button>
        )}
        {!activeCalendar ? (
          data.length > 0 ? (
            <div className="p-5 mx-auto">
              <AssignmentTable
                data={data}
                products={products}
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={handlePageChange}
                tableRef={tableRefProducts}
                tableType="product"
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
      </TabsContent>
    </Tabs>
  );
}

export default Assignments;
