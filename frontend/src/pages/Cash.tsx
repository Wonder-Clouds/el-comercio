import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import capitalizeFirstLetter from "@/utils/capitalize";
import { formatDateToSpanishSafe } from "@/utils/formatDate";
import { getLocalDate } from "@/utils/getLocalDate";
import { Calendar } from "lucide-react";
import { motion } from "motion/react";
import CalendarPicker from "@/components/shared/CalendarPicker";
import CashTable from "@/components/cash/CashTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Cash = () => {
  const [activeCalendar, setActiveCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(getLocalDate());

  const handleDateSelect = (date: string | null) => {
    setSelectedDate(date);
    setActiveCalendar(false);
  };

  const formattedDate = selectedDate
    ? capitalizeFirstLetter(formatDateToSpanishSafe(selectedDate))
    : "Fecha seleccionada";

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-white shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-indigo-950 to-indigo-900 text-white rounded-t-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold">Caja</CardTitle>
              <span>Cuadrar caja de hoy</span>
            </div>
            <div className="flex flex-row items-center gap-4">
              <Button
                onClick={() => setActiveCalendar(!activeCalendar)}
                variant="outline"
                className="flex items-center gap-2 border-2 text-black border-blue-200 hover:bg-blue-50 transition-colors"
              >
                <Calendar className="w-5 h-5" />
                Cambiar fecha
              </Button>
              <Badge variant="outline" className="text-lg font-semibold bg-white/20 text-white backdrop-blur-sm px-4 py-2">
                {formattedDate}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3">
          {activeCalendar && (
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
          )}

          <div className="flex flex-col md:flex-row gap-4 w-full">
            <Tabs defaultValue="cash_count" className="w-full">
              <div className="flex items-center justify-between ">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="cash_count">Conteo de billetes</TabsTrigger>
                  <TabsTrigger value="yape">YAPE</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="cash_count" className="flex flex-row pt-4 px-1">
                <div className="px-4 w-1/2">
                  <h4 className="text-3xl text-gray-800 p-2 text-center font-bold">COMERCIO</h4>
                  <CashTable
                    data={[]}
                  />
                </div>
                <div className="px-4 w-1/2">
                  <h4 className="text-3xl text-gray-800 p-2 text-center font-bold">OJO</h4>
                  <CashTable
                    data={[]}
                  />
                </div>
              </TabsContent>

              <TabsContent value="yape">

              </TabsContent>
            </Tabs>



          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Cash;