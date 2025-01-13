import { columns } from "@/components/sellers/columns";
import { SellersTable } from "@/components/sellers/SellersTable";
import Seller from "@/model/Seller";

function Sellers() {

  const data: Seller[] = [
    {
      id_seller: 1,
      name: "Product 1",
      last_name: "Product 1",
      dni: "12345678",
      status: true
    },
    {
      id_seller: 2,
      name: "Product 2",
      last_name: "Product 2",
      dni: "87654321",
      status: false
    }
  ]

  return (
    <>
      <h1 className="text-4xl font-bold">Clientes</h1>

      <div className="container mx-auto py-10">
        <SellersTable columns={columns} data={data} />
      </div>
    </>
  )
}

export default Sellers;