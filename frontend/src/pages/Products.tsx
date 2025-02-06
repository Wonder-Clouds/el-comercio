import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductManagement from "@/components/products/ProductManagement";
// Por ahora, NewspaperManagement se puede dejar como placeholder o implementarlo similar a ProductManagement.
import NewspaperManagement from "@/components/products/NewspaperManagement";

const Products = () => {
  return (
    <Tabs defaultValue="products" className="mx-auto space-y-6">
      <TabsList className="flex bg-gray-900 rounded-none py-7">
        <TabsTrigger value="products" className="px-5 text-lg data-[state=active]:text-black text-white">
          Productos
        </TabsTrigger>
        <TabsTrigger value="newspapers" className="px-5 text-lg data-[state=active]:text-black text-white">
          Periódicos
        </TabsTrigger>
      </TabsList>

      <TabsContent value="products" className="container space-y-5 mx-auto">
        <ProductManagement />
      </TabsContent>

      <TabsContent value="newspapers" className="container space-y-5 mx-auto">
        <NewspaperManagement />
      </TabsContent>
    </Tabs>
  );
};

export default Products;
