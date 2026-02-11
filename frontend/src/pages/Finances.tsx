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
import { Input } from "@/components/ui/input";
import FinancesTable from "@/components/finances/FinancesTable";
import { Finance, OperationType } from "@/models/Finance";
import { createFinance, getFinances } from "@/api/Finances.api";

// Componente reutilizable para formulario
const FinanceForm = ({
  formData,
  setFormData,
  onSubmit,
  label,
}: {
  formData: { description: string; amount: string };
  setFormData: React.Dispatch<React.SetStateAction<{ description: string; amount: string }>>;
  onSubmit: () => void;
  label: string;
}) => (
  <div className="flex flex-row px-1 gap-5 items-center my-2">
    <Input
      placeholder="Descripción"
      className="flex-1"
      value={formData.description}
      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
    />
    <Input
      placeholder="Total (S/.)"
      className="w-1/4"
      type="number"
      value={formData.amount}
      onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
    />
    <Button onClick={onSubmit} className="bg-primary font-semibold p-5 text-md">
      <FileInput className="h-4 w-4" />
      <span className="hidden md:inline">{label}</span>
    </Button>
  </div>
);

const Finances = () => {
  const [incomes, setIncomes] = useState<Finance[]>([]);
  const [expenses, setExpenses] = useState<Finance[]>([]);

  const [incomeForm, setIncomeForm] = useState({ description: "", amount: "" });
  const [expenseForm, setExpenseForm] = useState({ description: "", amount: "" });

  // const [loading, setLoading] = useState(true);
  const [pageIncomes, setPageIncomes] = useState(1);
  const [pageSizeIncomes] = useState(10);
  const [pageExpenses, setPageExpenses] = useState(1);
  const [pageSizeExpenses] = useState(10);
  const [totalIncomes, setTotalIncomes] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const [activeCalendar, setActiveCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(getLocalDate());

  const fetchIncomes = useCallback(async () => {
    const date = selectedDate || getLocalDate();
    try {
      const incomes = await getFinances(pageIncomes, pageSizeIncomes, OperationType.INCOME, date);
      setIncomes(incomes.results);
      setTotalIncomes(incomes.count);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }, [pageIncomes, pageSizeIncomes, selectedDate]);

  const fetchExpenses = useCallback(async () => {
    const date = selectedDate || getLocalDate();
    try {
      const expenses = await getFinances(pageExpenses, pageSizeExpenses, OperationType.EXPENSE, date);
      setExpenses(expenses.results);
      setTotalExpenses(expenses.count);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }, [pageExpenses, pageSizeExpenses, selectedDate]);

  const createIncome = async () => {
    const { description, amount } = incomeForm;
    if (!description || !amount) return;

    await createFinance({
      id: 0,
      description,
      type_operation: OperationType.INCOME,
      amount: parseFloat(amount),
    });
    setIncomeForm({ description: "", amount: "" });
    fetchIncomes();
  };

  const createExpense = async () => {
    const { description, amount } = expenseForm;
    if (!description || !amount) return;

    await createFinance({
      id: 0,
      description,
      type_operation: OperationType.EXPENSE,
      amount: parseFloat(amount),
    });
    setExpenseForm({ description: "", amount: "" });
    fetchExpenses();
  };

  useEffect(() => {
    fetchIncomes();
    fetchExpenses();
  }, [fetchIncomes, fetchExpenses]);

  const handlePageIncomesChange = (newPage: number) => {
    setPageIncomes(newPage);
  };

  const handlePageExpensesChange = (newPage: number) => {
    setPageExpenses(newPage);
  };

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
        <CardHeader className="bg-primary text-white rounded-t-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold">Finanzas</CardTitle>
              <span>Ingresar ingresos y egresos de hoy</span>
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
            {/* Ingresos */}
            <div className="px-4 w-full md:w-1/2">
              <h4 className="text-3xl text-gray-800 p-2 text-center font-bold">INGRESOS</h4>
              <FinanceForm
                formData={incomeForm}
                setFormData={setIncomeForm}
                onSubmit={createIncome}
                label="Registrar ingreso"
              />
              <FinancesTable
                data={incomes}
                page={pageIncomes}
                pageSize={pageSizeIncomes}
                totalCount={totalIncomes}
                onPageChange={handlePageIncomesChange}
              />
            </div>

            {/* Egresos */}
            <div className="px-4 w-full md:w-1/2">
              <h4 className="text-3xl text-gray-800 p-2 text-center font-bold">EGRESOS</h4>
              <FinanceForm
                formData={expenseForm}
                setFormData={setExpenseForm}
                onSubmit={createExpense}
                label="Registrar egreso"
              />
              <FinancesTable
                data={expenses}
                page={pageExpenses}
                pageSize={pageSizeExpenses}
                totalCount={totalExpenses}
                onPageChange={handlePageExpensesChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Finances;
