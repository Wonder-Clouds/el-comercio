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
import { BarChart2, CalendarIcon, Package, TrendingUp, Users } from "lucide-react";
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
    <div className="container mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Panel de Reportes</h1>
        <p className="text-muted-foreground mt-2">
          Monitorea y analiza el rendimiento de tu negocio
        </p>
      </div>

      {/* Date Selector Card */}
      <Card className="mb-8 bg-white shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-medium">Rango de Fechas</h2>
              <p className="text-sm text-muted-foreground">
                Selecciona el período para los reportes
              </p>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="h-4 w-4" />
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

      {/* Financial Summary Section */}
      <div className="grid gap-6 mb-8">
        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-xl">Resumen Financiero</CardTitle>
              <CardDescription>
                Vista general del rendimiento financiero
              </CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
            <div className="p-6 bg-gray-50 rounded-lg">
              <Profits data={profitsData} dateRange={date} />
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <MonthlyEarnings data={monthlyEarningsData} dateRange={date} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Analysis Section */}
      <div className="grid gap-6 mb-8">
        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-xl">Análisis de Productos</CardTitle>
              <CardDescription>
                Desempeño y tendencias de productos
              </CardDescription>
            </div>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
            <div className="p-6 bg-gray-50 rounded-lg">
              <TopNewsPapers data={topNewsPapersData} dateRange={date} />
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <TopProducts data={topProductsData} dateRange={date} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Performance Section */}
      <div className="grid gap-6 mb-8">
        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-xl">Rendimiento de Ventas</CardTitle>
              <CardDescription>
                Análisis detallado del equipo de ventas
              </CardDescription>
            </div>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="p-6 bg-gray-50 rounded-lg">
              <SalesBySellers data={salesData} dateRange={date} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Efficiency Section */}
      <div className="grid gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-xl">Eficiencia Operativa</CardTitle>
              <CardDescription>
                Métricas de eficiencia y retornos
              </CardDescription>
            </div>
            <BarChart2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="p-6 bg-gray-50 rounded-lg">
              <ReturnsAndEfficiency
                data={returnsAndEfficiencyData}
                dateRange={date}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Reports;
