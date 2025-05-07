import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { DateRange } from "react-day-picker";
import type { MonthlyEarnings } from "@/models/Report";

const chartConfig = {
  earnings: {
    label: "Ganancia Mensual",
    color: "#56282D",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

interface MonthlyEarningsProps {
  data: MonthlyEarnings[] | null;
  dateRange: DateRange | undefined;
}

export function MonthlyEarnings({ data, dateRange }: MonthlyEarningsProps) {
  const [, setTrend] = useState<number>(0);

  useEffect(() => {
    if (data && data.length >= 2) {
      const lastMonth = data[data.length - 1].total_earnings;
      const previousMonth = data[data.length - 2].total_earnings;
      const trendPercentage = ((lastMonth - previousMonth) / previousMonth) * 100;
      setTrend(trendPercentage);
    }
  }, [data]);

  const formattedData = data?.map(item => ({
    ...item,
    ganancia_mensual: item.total_earnings
  }));

  const formattedDateRange = dateRange?.from && dateRange?.to
  ? `${format(dateRange.from, "MMMM yyyy", { locale: es })} - ${format(dateRange.to, "MMMM yyyy", { locale: es })}`
  : "Seleccione un rango de fechas";

  return (
    <div>
      <CardHeader>
        <CardTitle>Ganancias Mensuales</CardTitle>
                <CardDescription>{formattedDateRange}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={formattedData || []}
            layout="vertical"
            margin={{ right: 100 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => format(parseISO(value), "MMM", { locale: es })}
              hide
            />
            <XAxis dataKey="ganancia_mensual" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Bar dataKey="ganancia_mensual" layout="vertical" fill="var(--color-earnings)" radius={4}>
              <LabelList
                dataKey="month"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
                formatter={(value: string) => format(parseISO(value), "MMM", { locale: es })}
              />
              <LabelList
                dataKey="ganancia_mensual"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => `S/ ${value.toFixed(2)}`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </div>
  );
}
