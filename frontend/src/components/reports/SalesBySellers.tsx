import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { DateRange } from "react-day-picker"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { SalesBySellers } from "@/models/Report"

interface SalesBySellersProps {
  data: SalesBySellers[] | null
  dateRange: DateRange | undefined
}

export function SalesBySellers({ data, dateRange }: SalesBySellersProps) {
  const formatSoles = (value: number) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(value)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas por Vendedor</CardTitle>
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="assignment__seller__name" tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" tickLine={false} axisLine={false} tickFormatter={(value) => formatSoles(value)} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value.toLocaleString("es-PE")}
                />
                <Tooltip
                  formatter={(value: number, name) => {
                    if (name === "Monto Total") return [formatSoles(value), name]
                    return [value.toLocaleString("es-PE"), name]
                  }}
                  labelFormatter={(label) => `Vendedor: ${label}`}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="total_amount" name="Monto Total" fill="#73BA9B" radius={[4, 4, 0, 0]} />
                <Bar
                  yAxisId="right"
                  dataKey="total_sold"
                  name="Cantidad Vendida"
                  fill="#003E1F"
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
  )
}

