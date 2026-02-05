import { useCallback, useEffect, useState } from "react";
import { getAssignments } from "@/api/Assignment.api";
import { Assignment } from "@/models/Assignment";
import { Item } from "@/models/Product";
import capitalizeFirstLetter from "@/utils/capitalize";
import { formatDateToSpanishSafe } from "@/utils/formatDate";
import { getLocalDate } from "@/utils/getLocalDate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Calendar, ClipboardList, DollarSign, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import generateDailySummaryPDF from "@/utils/generatePdfs/generateDailySummaryPdf";
import { motion } from "motion/react"
import { Skeleton } from "@/components/ui/skeleton";
import DevolutionTable from "@/components/devolutions/DevolutionsTable";
import CalendarPicker from "@/components/shared/CalendarPicker";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router";
import generateSalesReport from "@/utils/generatePdfs/generateSalesReport";
import { Types } from "@/models/TypeProduct";

const Returns = () => {
  const { type } = useParams();
  const itemType = type === "productos" ? Types.PRODUCT : Types.NEWSPAPER;

  const pageTitle = itemType === Types.PRODUCT ? "Devolución de Productos" : "Devolución de Periódicos";

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  const [activeCalendar, setActiveCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(getLocalDate());

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const refreshAssignments = useCallback(async (detailAssignmentId: number) => {
    console.log(detailAssignmentId)
    if (selectedDate) {
      try {
        const assignments = await getAssignments(page, pageSize, selectedDate, selectedDate);
        setAssignments(assignments.results);
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
        setAssignments(assignments.results);
        setTotalCount(assignments.count);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }
  }, [page, pageSize, selectedDate]);

  const fetchAssignments = useCallback(async () => {
    if (selectedDate) {
      setLoading(true);
      try {
        const assignments = await getAssignments(page, pageSize, selectedDate, selectedDate);
        setAssignments(assignments.results);
        setTotalCount(assignments.count);
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    } else {
      const yesterday = getLocalDate(-1);
      try {
        const assignments = await getAssignments(page, pageSize, yesterday);
        setAssignments(assignments.results);
        setTotalCount(assignments.count);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }
  }, [page, pageSize, selectedDate]);

  useEffect(() => {
    fetchAssignments();
  }, [type, fetchAssignments]);

  useEffect(() => {
    if (assignments.length > 0) {
      const items = assignments[0].products ?? [];

      const filteredItems = items.filter(
        (item) => item.type_product?.type === itemType
      );

      setItems(filteredItems);
    }
  }, [assignments, itemType]);

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
              {pageTitle}
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


              <Button
                onClick={() => generateDailySummaryPDF(assignments, itemType)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                Reporte del día
              </Button>

              <Button
                onClick={() => generateSalesReport(assignments)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ClipboardList className="w-4 h-4" />
                Liquidación
              </Button>
            </div>
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

          <div className="px-1">
            {loading ? (
              <div className="space-y-4 p-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : assignments.length > 0 ? (
              <DevolutionTable
                data={assignments}
                products={items}
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={handlePageChange}
                refreshData={refreshAssignments}
                tableType={itemType}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No hay asignaciones</h3>
                <p className="text-gray-500 max-w-md">
                  No se encontraron asignaciones para {formattedDate}.
                  {isToday && " Puedes crear nuevas asignaciones usando el botón 'Asignar periódicos para hoy'."}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Returns;