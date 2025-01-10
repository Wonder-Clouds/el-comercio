import Product from "@/model/Product"
import { columns } from "./columns"
import { DataTable } from "./data-table"

export default function ProductsTable() {
  const data: Product[] = [
    {
      id: 1,
      name: "Product 1",
      type: "PERIODICOS",
      returns_date: 1
    },
    {
      id: 2,
      name: "Product 2",
      type: "PRODUCTO",
      returns_date: 15
    }
  ]

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
