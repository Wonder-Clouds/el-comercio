import ProductForm from "@/components/products/ProductForm";

function AddProduct() {
  return (
    <>
      <h1 className="text-3xl text-start font-bold pb-5">Nuevo producto</h1>
      <ProductForm />
    </>
  );
}

export default AddProduct;