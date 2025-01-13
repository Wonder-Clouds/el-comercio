import { ProductTable } from "@/components/products/ProductTable";
import { Button } from "@/components/ui/button";
import { Product, ProductType } from "@/model/Product";
import { columns } from "../components/products/columns";
import { Link } from "react-router";

const Products = () => {
  const data: Product[] = [
    {
      id_product: 1,
      name: "Product 1",
      type: ProductType.NEWSPAPER,
      returns_date: 1
    },
    {
      id_product: 2,
      name: "Product 2",
      type: ProductType.PRODUCT,
      returns_date: 15
    }
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
            className="hover:text-gray-300 transition-colors"
          >
            <Button>Nuevo producto</Button>
          </Link>
        </div>
      </div>
      <div className="container mx-auto py-10">
        <ProductTable columns={columns} data={data} />
      </div>
    </>
  );
}

export default Products;