import * as React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Pie, PieChart, ResponsiveContainer, Label } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import type { DateRange } from "react-day-picker"
import type { ReturnsAndEfficiencyResponse, ReturnsAndEfficiency as ReturnsAndEfficiencyType } from "@/models/Report"

interface ReturnsAndEfficiencyProps {
  data: ReturnsAndEfficiencyResponse | null
  dateRange: DateRange | undefined
}

export function ReturnsAndEfficiency({ data, dateRange }: ReturnsAndEfficiencyProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardContent>No hay datos disponibles</CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Resumen de Devoluciones y Eficiencia</CardTitle>
        <CardDescription>
          {dateRange?.from && dateRange?.to
            ? `Del ${dateRange.from.toLocaleDateString()} al ${dateRange.to.toLocaleDateString()}`
            : "Rango de fechas no seleccionado"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((vendedorData) => (
          <SellerCard key={vendedorData.assignment__seller__name} vendedorData={vendedorData} />
        ))}
      </CardContent>
    </Card>
  )
}

function SellerCard({ vendedorData }: { vendedorData: ReturnsAndEfficiencyType }) {
  const chartData = React.useMemo(
    () => [
      {
        categoria: "Productos Vendidos",
        valor: vendedorData.total_sold,
        fill: "#4CAF50",
      },
      {
        categoria: "Productos Devueltos",
        valor: vendedorData.total_returned,
        fill: "#f44336",
      },
      {
        categoria: "Impacto en Ventas en Ventas",
        valor: vendedorData.impact_on_sales,
        fill: "#2196F3",
      },
    ],
    [vendedorData],
  )

  const totalProducts = React.useMemo(() => {
    return vendedorData.total_sold + vendedorData.total_returned
  }, [vendedorData])

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg">{vendedorData.assignment__seller__name}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          {vendedorData.return_percentage === 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={vendedorData.return_percentage === 0 ? "text-green-500" : "text-red-500"}>
            {vendedorData.return_percentage === 0
              ? "Sin devoluciones"
              : `${vendedorData.return_percentage.toFixed(2)}% de devoluciones`}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="valor"
                nameKey="categoria"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                            {totalProducts}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground text-xs">
                            Total
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="grid grid-cols-3 w-full gap-2 text-center">
          <div>
            <p className="font-bold text-green-600">{vendedorData.total_sold}</p>
            <p className="text-xs text-muted-foreground">Productos Vendidos</p>
          </div>
          <div>
            <p className="font-bold text-red-600">{vendedorData.total_returned}</p>
            <p className="text-xs text-muted-foreground">Productos Devueltos</p>
          </div>
          <div>
            <p className="font-bold text-blue-600">{vendedorData.impact_on_sales.toFixed(2)}%</p>
            <p className="text-xs text-muted-foreground">Impacto en Ventas</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default ReturnsAndEfficiency

