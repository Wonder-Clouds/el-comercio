import { getAssignments, postAllAssignments } from "@/api/Assignment.api";
import { getProductsByDate } from "@/api/Product.api";
import AssignmentTable from "@/components/assignments/AssignmentTable";
import CalendarPicker from "@/components/shared/CalendarPicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Assignment } from "@/models/Assignment";
import { Item, ProductType } from "@/models/Product";
import capitalizeFirstLetter from "@/utils/capitalize";
import { formatDateToSpanishSafe } from "@/utils/formatDate";
import { getLocalDate } from "@/utils/getLocalDate";
import printElement from "@/utils/printElement";
import { Calendar, FileDown, Printer, AlertCircle, RefreshCw, FilePenLine } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react"
import { Skeleton } from "@/components/ui/skeleton";
import AssignmentModal from "@/components/assignments/AssignmentModal";
import * as XLSX from 'xlsx';

const AssignmentProduct = () => {
  const tableRefProducts = useRef<HTMLDivElement>(null);

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [products, setProducts] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [activeCalendar, setActiveCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(getLocalDate());

  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [totalCount, setTotalCount] = useState(0);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchAssignments = useCallback(async () => {
    if (selectedDate) {
      setLoading(true);
      try {
        const assignments = await getAssignments(page, pageSize, selectedDate, selectedDate);
        setAssignments(assignments.results);
        setTotalCount(assignments.count);
      } catch (error) {
        if (error instanceof Error) {
          // toast({
          //   title: "Error al cargar asignaciones",
          //   description: error.message,
          //   variant: "destructive"
          // });
        }
      } finally {
        setLoading(false);
      }
    } else {
      const today = getLocalDate();
      setLoading(true);
      try {
        const assignments = await getAssignments(page, pageSize, today);
        setAssignments(assignments.results);
        setTotalCount(assignments.count);
      } catch (error) {
        if (error instanceof Error) {
          // toast({
          //   title: "Error al cargar asignaciones",
          //   description: error.message,
          //   variant: "destructive"
          // });
        }
      } finally {
        setLoading(false);
      }
    }
  }, [page, pageSize, selectedDate]);

  const generateExcel = (data: Assignment[]) => {
    const worksheetData = [];

    // Add header
    worksheetData.push([
      'Assignment ID', 'Seller Name', 'Seller Code', 'Product Name', 'Quantity',
      'Unit Price', 'Total Price', 'Status', 'Return Date', 'Date Assignment'
    ]);

    // Iterar sobre cada asignación
    data.forEach((assignment) => {
      // Iterar sobre los detalles de cada asignación
      assignment.detail_assignments?.forEach((detail) => {
        const totalPrice = (detail.unit_price * detail.quantity).toFixed(2);  // Asegúrate de convertir el unit_price a número
        worksheetData.push([
          assignment.id,
          `${assignment.seller.name} ${assignment.seller.last_name}`,
          assignment.seller.number_seller,
          detail.product.name,
          detail.quantity,
          detail.unit_price,
          totalPrice,
          detail.status,
          detail.return_date,
          assignment.date_assignment
        ]);
      });
    });

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Assignment Details');

    // Write Excel file to browser
    XLSX.writeFile(wb, 'assignment_details.xlsx');
  };

  const fetchProducts = useCallback(async () => {
    const today = getLocalDate();
    const date = selectedDate || today;
    try {
      const products = await getProductsByDate(date, ProductType.PRODUCT);
      setProducts(products.results);
      setTotalCount(products.count);
    } catch (error) {
      if (error instanceof Error) {
        // toast({
        //   title: "Error al cargar productos",
        //   description: error.message,
        //   variant: "destructive"
        // });
      }
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
    fetchProducts();
  }, [fetchAssignments, fetchProducts]);

  const handlePrintProducts = () => {
    if (tableRefProducts.current) {
      const clone = tableRefProducts.current.cloneNode(true) as HTMLElement;
      clone.querySelectorAll(".action-column").forEach((el) => el.remove());
      printElement(clone, "Reporte de Productos");
    }
  };

  const handleCreateAssignments = async () => {
    await fetchProducts();
    setCreating(true);
    try {
      await postAllAssignments();
      await fetchAssignments();
      // toast({
      //   title: "Asignación exitosa",
      //   description: "Los productos han sido asignados correctamente",
      //   variant: "default",
      // });
    } catch (error) {
      if (error instanceof Error) {
        // toast({
        //   title: "Error al crear asignaciones",
        //   description: error.message,
        //   variant: "destructive"
        // });
      }
    } finally {
      // setCreating(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDateSelect = (date: string | null) => {
    setSelectedDate(date);
    setActiveCalendar(false);
  };

  const isToday = selectedDate === getLocalDate();
  const formattedDate = assignments.length > 0
    ? capitalizeFirstLetter(formatDateToSpanishSafe(assignments[0].date_assignment.toString()))
    : selectedDate
      ? capitalizeFirstLetter(formatDateToSpanishSafe(selectedDate))
      : "Fecha seleccionada";

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-white shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-indigo-950 to-indigo-900 text-white rounded-t-lg p-6">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold">
              Asignación de Productos
            </CardTitle>
            <Badge variant="outline" className="text-lg font-semibold bg-white/20 text-white backdrop-blur-sm px-4 py-2">
              {formattedDate}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setActiveCalendar(!activeCalendar)}
                variant="outline"
                className="flex items-center gap-2 border-2 border-blue-200 hover:bg-blue-50 transition-colors"
              >
                <Calendar className="w-5 h-5" />
                Cambiar fecha
              </Button>

              <Button
                onClick={() => generateExcel(assignments)}
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

              {(assignments.length > 0 || !isToday) && (
                <Button
                  onClick={fetchAssignments}
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Actualizar
                </Button>
              )}
            </div>

            {isToday && (
              <div>
                {products.length === 0 ? (
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    size="lg"
                    className="bg-blue-800 hover:bg-blue-900 font-bold px-6 py-6 text-lg"
                    disabled={creating}
                  >
                    {creating ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        Asignando...
                      </>
                    ) : (
                      <>
                        <FilePenLine className="h-5 w-5" />
                        Asignar productos para hoy
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowCreateModal(true)} // <- nuevo handler para editar
                    size="lg"
                    className="bg-blue-800 hover:bg-blue-900 font-bold px-6 py-6 text-lg"
                  >
                    <FilePenLine className="h-5 w-5" />
                    Editar productos asignados
                  </Button>
                )}
              </div>
            )}
          </div>

          {activeCalendar ? (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Card className="border shadow-md">
                <CardContent className="p-4">
                  <CalendarPicker
                    onDateSelect={handleDateSelect}
                    changeStatusCalendar={() => setActiveCalendar(false)}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ) : null}

          <div className="rounded-lg border bg-card">
            <Tabs defaultValue="assignments" className="w-full">
              <div className="flex items-center justify-between px-6 pt-4">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="assignments">Asignaciones</TabsTrigger>
                  <TabsTrigger value="stats">Estadísticas</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="assignments" className="pt-4 px-1">
                {loading ? (
                  <div className="space-y-4 p-6">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : assignments.length > 0 ? (
                  <div className="p-2">
                    <AssignmentTable
                      data={assignments}
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
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No hay asignaciones</h3>
                    <p className="text-gray-500 max-w-md">
                      No se encontraron asignaciones para {formattedDate}.
                      {isToday && " Puedes crear nuevas asignaciones usando el botón 'Asignar productos para hoy'."}
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="stats">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Asignaciones
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalCount}</div>
                      <p className="text-xs text-muted-foreground">
                        +{Math.floor(Math.random() * 10)}% desde el mes pasado
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Productos Disponibles
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{products.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {products.length} productos activos
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Eficiencia
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">98%</div>
                      <p className="text-xs text-muted-foreground">
                        +2% desde la semana pasada
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>


      {/* Assignment creation modal */}
      {showCreateModal && (
        <AssignmentModal type={ProductType.PRODUCT} closeModal={() => setShowCreateModal(false)} updateData={handleCreateAssignments} initialProducts={products} />
      )}

    </div>
  );
}

export default AssignmentProduct;