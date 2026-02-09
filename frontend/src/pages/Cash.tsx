import { useCallback, useEffect, useState } from "react";
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
import { getCash, patchCash, postCash } from "@/api/Cash.api";
import { Cash as CashModel, CashRow, cashToRows, defaultCash, TypesCash } from "@/models/Cash";
import { Input } from "@/components/ui/input";
import generateCashReportPdf from "@/utils/generatePdfs/generateCashReportPdf";

const Cash = () => {
  const [cashComercio, setCashComercio] = useState<CashModel[]>([]);
  const [cashOjo, setCashOjo] = useState<CashModel[]>([]);
  const [cashRowsComercio, setCashRowsComercio] = useState<CashRow[]>(cashToRows(defaultCash));
  const [cashRowsOjo, setCashRowsOjo] = useState<CashRow[]>(cashToRows(defaultCash));

  const [yapeNombre, setYapeNombre] = useState("");
  const [yapeCodigo, setYapeCodigo] = useState("");
  const [yapeMonto, setYapeMonto] = useState("");
  const [yapes, setYapes] = useState<Yape[]>([]);

  const [activeCalendar, setActiveCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(getLocalDate());

  const handleDateSelect = (date: string | null) => {
    setSelectedDate(date);
    setActiveCalendar(false);
  };

  const formattedDate = selectedDate
    ? capitalizeFirstLetter(formatDateToSpanishSafe(selectedDate))
    : "Fecha seleccionada";

  const fetchCashComercio = useCallback(async () => {
    const baseDate = selectedDate || getLocalDate();

    const date = new Date(baseDate);
    date.setDate(date.getDate() + 1);

    const dateTo = date.toISOString().split("T")[0];

    const response = await getCash(
      TypesCash.COMERCIO,
      baseDate,
      dateTo
    );

    setCashComercio(response);
  }, [selectedDate]);

  const fetchCashOjo = useCallback(async () => {
    const baseDate = selectedDate || getLocalDate();

    const date = new Date(baseDate);
    date.setDate(date.getDate() + 1);

    const dateTo = date.toISOString().split("T")[0];
    const response = await getCash(TypesCash.OJO, baseDate, dateTo);
    setCashOjo(response);
  }, [selectedDate]);

  const fetchYapeData = useCallback(async () => {
    const baseDate = selectedDate || getLocalDate();

    const date = new Date(baseDate);
    date.setDate(date.getDate() + 1);

    const dateTo = date.toISOString().split("T")[0];
    const response = await getYapes(baseDate, dateTo);
    setYapes(response);
  }, [selectedDate]);

  const handleSaveCashComercio = async () => {
    const cashData = {
      id: 0,
      date_cash: selectedDate || new Date().toISOString().split("T")[0],
      type_product: TypesCash.COMERCIO,
      two_hundred: cashRowsComercio[0].quantity,
      one_hundred: cashRowsComercio[1].quantity,
      fifty: cashRowsComercio[2].quantity,
      twenty: cashRowsComercio[3].quantity,
      ten: cashRowsComercio[4].quantity,
      five: cashRowsComercio[5].quantity,
      two: cashRowsComercio[6].quantity,
      one: cashRowsComercio[7].quantity,
      fifty_cents: cashRowsComercio[8].quantity,
      twenty_cents: cashRowsComercio[9].quantity,
      ten_cents: cashRowsComercio[10].quantity,
      amount: cashRowsComercio.reduce((sum, row) => sum + row.total, 0),
    };

    try {
      await postCash(cashData);
      console.log("Cash guardado correctamente.");
    } catch (error) {
      console.error("Error al guardar cash:", error);
    }
  };

  const handleUpdateCashComercio = async () => {
    if (cashComercio.length === 0) return;

    const existingCash = cashComercio[0];

    const updatedCash = {
      ...existingCash,
      two_hundred: cashRowsComercio[0].quantity,
      one_hundred: cashRowsComercio[1].quantity,
      fifty: cashRowsComercio[2].quantity,
      twenty: cashRowsComercio[3].quantity,
      ten: cashRowsComercio[4].quantity,
      five: cashRowsComercio[5].quantity,
      two: cashRowsComercio[6].quantity,
      one: cashRowsComercio[7].quantity,
      fifty_cents: cashRowsComercio[8].quantity,
      twenty_cents: cashRowsComercio[9].quantity,
      ten_cents: cashRowsComercio[10].quantity,
      amount: cashRowsComercio.reduce((sum, row) => sum + row.total, 0),
    };

    try {
      await patchCash(updatedCash);
      console.log("Cash actualizado correctamente.");
      fetchCashComercio();
    } catch (error) {
      console.error("Error al actualizar cash:", error);
    }
  };

  const handleSaveCashOjo = async () => {
    const cashData = {
      id: 0,
      date_cash: selectedDate || new Date().toISOString().split("T")[0],
      type_product: TypesCash.OJO,
      two_hundred: cashRowsOjo[0].quantity,
      one_hundred: cashRowsOjo[1].quantity,
      fifty: cashRowsOjo[2].quantity,
      twenty: cashRowsOjo[3].quantity,
      ten: cashRowsOjo[4].quantity,
      five: cashRowsOjo[5].quantity,
      two: cashRowsOjo[6].quantity,
      one: cashRowsOjo[7].quantity,
      fifty_cents: cashRowsOjo[8].quantity,
      twenty_cents: cashRowsOjo[9].quantity,
      ten_cents: cashRowsOjo[10].quantity,
      amount: cashRowsOjo.reduce((sum, row) => sum + row.total, 0),
    };

    try {
      await postCash(cashData);
      console.log("Cash guardado correctamente.");
    } catch (error) {
      console.error("Error al guardar cash:", error);
    }
  };

  const handleUpdateCashOjo = async () => {
    if (cashOjo.length === 0) return;

    const existingCash = cashOjo[0];

    const updatedCash = {
      ...existingCash,
      two_hundred: cashRowsOjo[0].quantity,
      one_hundred: cashRowsOjo[1].quantity,
      fifty: cashRowsOjo[2].quantity,
      twenty: cashRowsOjo[3].quantity,
      ten: cashRowsOjo[4].quantity,
      five: cashRowsOjo[5].quantity,
      two: cashRowsOjo[6].quantity,
      one: cashRowsOjo[7].quantity,
      fifty_cents: cashRowsOjo[8].quantity,
      twenty_cents: cashRowsOjo[9].quantity,
      ten_cents: cashRowsOjo[10].quantity,
      amount: cashRowsOjo.reduce((sum, row) => sum + row.total, 0),
    };

    try {
      await patchCash(updatedCash);
      fetchCashOjo();
    } catch (error) {
      console.error("Error al actualizar cash:", error);
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
    fetchCashComercio();
    fetchCashOjo();
    fetchYapeData();
  }, [fetchCashComercio, fetchCashOjo, fetchYapeData]);

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-white shadow-lg border-0">
        <CardHeader className="bg-primary text-white rounded-t-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold">Caja</CardTitle>
              <span>Cuadrar caja de hoy</span>
            </div>
            <div className="flex flex-row items-center gap-4">
              <Button
                onClick={() => setActiveCalendar(!activeCalendar)}
                variant="outline"
                className="flex items-center gap-2 text-black transition-colors"
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
              <div className="flex items-center justify-between px-5">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="cash_count">Conteo de billetes</TabsTrigger>
                  <TabsTrigger value="yape">YAPE</TabsTrigger>
                </TabsList>
                <Button className="bg-primary" onClick={() => generateCashReportPdf(cashComercio[0], cashOjo[0], yapes)}>Generar reporte del día</Button>
              </div>

              <TabsContent value="cash_count" className="flex flex-row px-1">
                <div className="px-4 w-1/2">
                  <div className="flex justify-between">
                    <h4 className="text-3xl text-gray-800 p-2 text-center font-bold">COMERCIO</h4>
                    <Button className="bg-primary"
                      onClick={
                        cashComercio && cashComercio.length > 0
                          ? handleUpdateCashComercio
                          : handleSaveCashComercio
                      }                    >
                      {cashComercio.length > 0 ? "Actualizar" : "Guardar"}
                    </Button>
                  </div>
                  <CashTable
                    data={cashComercio}
                    cashRows={cashRowsComercio}
                    setCashRows={setCashRowsComercio}
                  />
                </div>
                <div className="px-4 w-1/2">
                  <div className="flex justify-between">
                    <h4 className="text-3xl text-gray-800 p-2 text-center font-bold">OJO</h4>
                    <Button className="bg-primary"
                      onClick={
                        cashOjo && cashOjo.length > 0
                          ? handleUpdateCashOjo
                          : handleSaveCashOjo
                      }
                    >
                      {cashOjo.length > 0 ? "Actualizar" : "Guardar"}
                    </Button>
                  </div>
                  <CashTable
                    data={cashOjo}
                    cashRows={cashRowsOjo}
                    setCashRows={setCashRowsOjo}
                  />
                </div>
              </TabsContent>

              <TabsContent value="yape">
                <div className="flex flex-wrap gap-4 py-2">
                  <Input
                    placeholder="Nombre"
                    className="flex-1 min-w-[200px]"
                    value={yapeNombre}
                    onChange={(e) => setYapeNombre(e.target.value)}
                  />
                  <Input
                    placeholder="Código de operación"
                    type="number"
                    className="w-full sm:w-1/4 min-w-[150px]"
                    value={yapeCodigo}
                    onChange={(e) => setYapeCodigo(e.target.value)}
                  />
                  <Input
                    placeholder="Monto (S/.)"
                    className="flex-1 min-w-[150px]"
                    value={yapeMonto}
                    onChange={(e) => setYapeMonto(e.target.value)}
                  />
                  <Button
                    onClick={handleAddYape}
                    className="bg-primary font-semibold px-4 py-2 text-md flex items-center gap-2"
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