import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import capitalizeFirstLetter from "@/utils/capitalize";
import { formatDateToSpanishSafe } from "@/utils/formatDate";
import { getLocalDate } from "@/utils/getLocalDate";
import { Calendar, FileInput } from "lucide-react";
import { motion } from "motion/react";
import CalendarPicker from "@/components/shared/CalendarPicker";
import CashTable from "@/components/cash/CashTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getYapes, postYapes } from "@/api/Yape.api";
import { Yape } from "@/models/Yape";
import YapeTable from "@/components/yape/YapeTable";
import { getCash, postCash } from "@/api/Cash.api";
import { Cash as CashModel, CashRow, cashToRows, defaultCash } from "@/models/Cash";
import { Input } from "@/components/ui/input";

const Cash = () => {
  const [cashData, setCashData] = useState<CashModel[]>([]);
  const [yapeNombre, setYapeNombre] = useState("");
  const [yapeCodigo, setYapeCodigo] = useState("");
  const [yapeMonto, setYapeMonto] = useState("");
  const [yapes, setYapes] = useState<Yape[]>([]);
  const [cashRows, setCashRows] = useState<CashRow[]>(cashToRows(defaultCash));

  const [activeCalendar, setActiveCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(getLocalDate());

  const handleDateSelect = (date: string | null) => {
    setSelectedDate(date);
    setActiveCalendar(false);
  };

  const formattedDate = selectedDate
    ? capitalizeFirstLetter(formatDateToSpanishSafe(selectedDate))
    : "Fecha seleccionada";

  const fetchCashData = async () => {
    const response = await getCash();
    setCashData(response);
  }

  const fetchYapeData = async () => {
    const response = await getYapes();
    setYapes(response);
  }

  const handleSaveCash = async () => {
    const cashData = {
      date_cash: selectedDate || new Date().toISOString().split("T")[0],
      two_hundred: cashRows[0].quantity,
      one_hundred: cashRows[1].quantity,
      fifty: cashRows[2].quantity,
      twenty: cashRows[3].quantity,
      ten: cashRows[4].quantity,
      five: cashRows[5].quantity,
      two: cashRows[6].quantity,
      one: cashRows[7].quantity,
      fifty_cents: cashRows[8].quantity,
      twenty_cents: cashRows[9].quantity,
      ten_cents: cashRows[10].quantity,
      amount: cashRows.reduce((sum, row) => sum + row.total, 0),
    };

    try {
      await postCash(cashData);
      console.log("Cash guardado correctamente.");
    } catch (error) {
      console.error("Error al guardar cash:", error);
    }
  };

  const handleAddYape = async () => {
    if (!yapeNombre || !yapeCodigo || !yapeMonto) return;

    try {
      await postYapes({
        id: 0,
        name: yapeNombre,
        operation_code: yapeCodigo,
        amount: parseFloat(yapeMonto),
        date_yape: selectedDate || new Date().toISOString().split("T")[0],
      });

      await fetchYapeData(); // refresca la lista
      setYapeNombre("");
      setYapeCodigo("");
      setYapeMonto("");
    } catch (error) {
      console.error("Error al agregar Yape:", error);
    }
  };

  useEffect(() => {
    fetchCashData();
    fetchYapeData();
  }, [selectedDate]);

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
                <div className="px-4 w-full">
                  <div className="flex justify-between">
                    <h4 className="text-3xl text-gray-800 p-2 text-center font-bold">COMERCIO</h4>
                    <Button onClick={handleSaveCash}>Guardar</Button>
                  </div>
                  <CashTable
                    data={cashData}
                    cashRows={cashRows}
                    setCashRows={setCashRows}
                  />
                </div>
                {/* <div className="px-4 w-1/2">
                  <h4 className="text-3xl text-gray-800 p-2 text-center font-bold">OJO</h4>
                  <CashTable
                    data={[]}
                  />
                </div> */}
              </TabsContent>

              <TabsContent value="yape">
                <div className="flex flex-row">
                  <Input
                    placeholder="Nombre"
                    className="flex-1"
                    value={yapeNombre}
                    onChange={(e) => setYapeNombre(e.target.value)}
                  />
                  <Input
                    placeholder="Código de operación"
                    className="w-1/4"
                    type="number"
                    value={yapeCodigo}
                    onChange={(e) => setYapeCodigo(e.target.value)}
                  />
                  <Input
                    placeholder="Monto (S/.)"
                    className="flex-1"
                    value={yapeMonto}
                    onChange={(e) => setYapeMonto(e.target.value)}
                  />
                  <Button
                    onClick={handleAddYape}
                    className="bg-blue-800 hover:bg-blue-900 font-semibold p-5 text-md"
                  >
                    <FileInput className="h-4 w-4" />
                    <span className="hidden md:inline">Añadir yape</span>
                  </Button>
                </div>
                <YapeTable
                  data={yapes}
                />
              </TabsContent>
            </Tabs>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Cash;