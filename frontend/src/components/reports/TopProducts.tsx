import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TopProductsResponse } from "@/models/Report";
import { DateRange } from "react-day-picker";

interface TopProductsProps {
  data: TopProductsResponse | null;
  dateRange: DateRange | undefined;
}

export function TopProducts({ data, dateRange }: TopProductsProps) {
  const formatSoles = (value: number) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(value);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos Más Vendidos</CardTitle>
        <CardDescription>
          {dateRange?.from && dateRange?.to
            ? `${format(dateRange.from, "d 'de' MMMM',' yyyy", { locale: es })} - ${format(dateRange.to, "d 'de' MMMM',' yyyy", { locale: es })}`
            : "Seleccione un rango de fechas"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          {data && data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis tickLine={false} axisLine={false} />
                <XAxis
                  type="category"
                  dataKey="product__name" 
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value: number, name) => {
                    if (name === "Ganancia Total") return [formatSoles(value), name];
                    return [value.toLocaleString("es-PE"), name];
                  }}
                  labelFormatter={(label) => `Producto: ${label}`}
                />
                <Legend />
                <Bar dataKey="total_amount" name="Ganancia Total" fill="#F39E60" radius={[4, 4, 0, 0]} />
                <Bar
                  dataKey="total_sold"
                  name="Productos Vendidos"
                  fill="#E16A54"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No hay datos disponibles para el rango de fechas seleccionado
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
