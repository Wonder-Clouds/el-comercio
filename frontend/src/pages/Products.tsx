import { ProductTable } from "@/components/products/ProductTable";
import { Button } from "@/components/ui/button";
import { ProductType } from "@/models/Product";
import { columns } from "../components/products/columns";
import { Link } from "react-router";
import { DayWeek, ProductPrice } from "@/models/ProductPrice";

const Products = () => {
  const data: ProductPrice[] = [
    {
      id_price_product: 1,
      product: {
        id_product: 1,
        name: "Producto 1",
        type: ProductType.PRODUCT,
        returns_date: 1
      },
      price: 100,
      day_week: DayWeek.SUNDAY,
      start_date: new Date()
    },
    {
      id_price_product: 2,
      product: {
        id_product: 2,
        name: "Producto 2",
        type: ProductType.PRODUCT,
        returns_date: 2
      },
      price: 200,
      day_week: DayWeek.TUESDAY,
      start_date: new Date()
    },
    {
      id_price_product: 3,
      product: {
        id_product: 3,
        name: "Producto 3",
        type: ProductType.NEWSPAPER,
        returns_date: 3
      },
      price: 300,
      day_week: DayWeek.WEDNESDAY,
      start_date: new Date()
    },
  ]
  return (
    <>
      <div className="flex flex-row justify-between">
        <h1 className="text-4xl font-bold">Productos</h1>
        <div className="flex flex-row gap-5">
          <Button>Exportar</Button>
          <Button>Imprimir</Button>
          <Link
            to="/nuevo-producto"
            className="transition-colors hover:text-gray-300"
          >
            <Button>Nuevo producto</Button>
          </Link>
        </div>
      </div>
      <div className="container py-10 mx-auto">
        <ProductTable columns={columns} data={data} />
      </div>
    </>
  );
}

export default Products;