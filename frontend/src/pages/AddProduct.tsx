import ProductForm from "@/components/products/ProductForm";

function AddProduct() {
  return (
    <div className="max-w-7xl mx-auto mt-12">
      <h1 className="text-3xl text-start font-bold pb-5">Nuevo producto</h1>
      <ProductForm />
    </div>
  );
}

export default AddProduct;