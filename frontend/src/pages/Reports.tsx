"use client";

import { useEffect, useState } from "react";
import {
  getSalesBySeller,
  getMonthlyEarnings,
  getTopProducts,
  getTopNewsPapers,
  getProfits,
  getReturnsAndEfficiency,
} from "@/api/Reports.api";
import { SalesBySellers } from "@/components/reports/SalesBySellers";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type {
  SalesBySellers as SalesBySellersType,
  MonthlyEarnings as MonthlyEarningsType,
  TopProductsResponse,
  TopNewsPapersResponse,
  ProfitsResponse,
  ReturnsAndEfficiencyResponse,
} from "@/models/Report";
import { MonthlyEarnings } from "@/components/reports/MonthlyEarnings";
import { TopProducts } from "@/components/reports/TopProducts";
import { TopNewsPapers } from "@/components/reports/TopNewsPapers";
import { Profits } from "@/components/reports/Profits";
import { ReturnsAndEfficiency } from "@/components/reports/ReturnsAndEfficiency";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

function Reports() {
  const [salesData, setSalesData] = useState<SalesBySellersType[] | null>(null);
  const [monthlyEarningsData, setMonthlyEarningsData] = useState<
    MonthlyEarningsType[] | null
  >(null);
  const [topProductsData, setTopProductsData] =
    useState<TopProductsResponse | null>(null);
  const [topNewsPapersData, setTopNewsPapersData] =
    useState<TopNewsPapersResponse | null>(null);
  const [profitsData, setProfitsData] = useState<ProfitsResponse | null>(null);
  const [returnsAndEfficiencyData, setReturnsAndEfficiencyData] =
    useState<ReturnsAndEfficiencyResponse | null>(null);

  const [date, setDate] = useState<DateRange>(() => {
    const today = new Date();
    return {
      from: new Date(today.getFullYear(), 0, 1),
      to: today,
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!date?.from || !date?.to) return;

      try {
        const startDate = format(date.from, "yyyy-MM-dd");
        const endDate = format(date.to, "yyyy-MM-dd");

        const [
          salesBySellers,
          monthlyEarnings,
          topProducts,
          topNewsPapers,
          profits,
          returnsAndEfficiency,
        ] = await Promise.all([
          getSalesBySeller(startDate, endDate),
          getMonthlyEarnings(startDate, endDate),
          getTopProducts(startDate, endDate),
          getTopNewsPapers(startDate, endDate),
          getProfits(startDate, endDate),
          getReturnsAndEfficiency(startDate, endDate),
        ]);

        setSalesData(salesBySellers);
        setMonthlyEarningsData(monthlyEarnings);
        setTopProductsData(topProducts);
        setTopNewsPapersData(topNewsPapers);
        setProfitsData(profits);
        setReturnsAndEfficiencyData(returnsAndEfficiency);
      } catch (error) {
        console.error("Error al obtener los datos", error);
      }
    };

    fetchData();
  }, [date]);

  return (
    <div className="container mx-auto mt-6 p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reportes</CardTitle>
          <CardDescription>
            Visualiza y analiza los datos de tu negocio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date.from && date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    <span>Seleccionar rango de fechas</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date.from}
                  selected={date}
                  onSelect={(newDate) => setDate(newDate || date)}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumen Financiero</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Profits data={profitsData} dateRange={date} />
          <MonthlyEarnings data={monthlyEarningsData} dateRange={date} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Análisis de Productos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TopNewsPapers data={topNewsPapersData} dateRange={date} />
          <TopProducts data={topProductsData} dateRange={date} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rendimiento de Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesBySellers data={salesData} dateRange={date} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eficiencia Operativa</CardTitle>
        </CardHeader>
        <CardContent>
          <ReturnsAndEfficiency
            data={returnsAndEfficiencyData}
            dateRange={date}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default Reports;
