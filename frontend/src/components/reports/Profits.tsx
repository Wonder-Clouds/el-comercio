import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ProfitsResponse } from "@/models/Report";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const chartConfig = {
  desktop: {
    label: "Ganancia por Vendedor",
    color: "#FBA518",
  },
} satisfies ChartConfig;

interface ProfitsProps {
  data: ProfitsResponse | null;
  dateRange: DateRange | undefined;
}

export function Profits({ data, dateRange }: ProfitsProps) {
  const chartData =
    data?.map((item) => ({
      seller: item.assignment__seller__name,
      profit: item.total_profit,
    })) || [];

  const formattedDateRange =
    dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, "MMMM yyyy", { locale: es })} - ${format(
          dateRange.to,
          "MMMM yyyy",
          { locale: es }
        )}`
      : "Seleccione un rango de fechas";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ganancias por Vendedor</CardTitle>
        <CardDescription>{formattedDateRange}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ right: 100 }}
          >
            <CartesianGrid horizontal={false} />
            <XAxis type="number" dataKey="profit" hide />
            <YAxis
              dataKey="seller"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="profit" fill="var(--color-desktop)" radius={5}>
              <LabelList
                dataKey="profit"
                position="right"
                offset={10} // Establece el margen hacia la derecha
                fontSize={12}
                className="fill-foreground"
                formatter={(value: number) => `S/ ${value.toFixed(2)}`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
