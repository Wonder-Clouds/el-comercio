import { Button } from "@/components/ui/button";

const Products = () => {
  return (
    <>
    <div className="flex flex-row justify-between m-12">
      <h1 className="text-4xl font-bold">Products</h1>
      <div className="flex flex-row gap-5">
        <Button>Exportar</Button>
        <Button>Imprimir</Button>
        <Button>Nuevo producto</Button>
      </div>
    </div>
    </>
  );
}

export default Products;