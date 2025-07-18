import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Ban, Save, Plus, Trash2, Package, Search, Tag, Calendar, CheckCircle, Hash, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { motion } from "motion/react";
import { Item, ItemCreateData } from "@/models/Product";
import { createItem, deleteProduct } from "@/api/Product.api";
import { TypeProduct, Types } from "@/models/TypeProduct";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { getTypeProducts } from "@/api/TypeProduct.api";

interface AssignmentModalProps {
  type: Types;
  closeModal: () => void;
  updateData: () => void;
  initialProducts?: Item[];
}

const AssignmentModal = ({ type, closeModal, updateData, initialProducts }: AssignmentModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [returnDays, setReturnDays] = useState("");
  const [price, setPrice] = useState("");
  const [totalQuantity, setTotalQuantity] = useState("");
  const [products, setProducts] = useState<ItemCreateData[]>([]);
  const [options, setOptions] = useState<TypeProduct[]>([]);
  const [selectedValue, setSelectedValue] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddSingleProduct = () => {
    if (name && returnDays && price && totalQuantity && selectedValue) {
      // Buscar el objeto TypeProduct completo
      const selectedTypeProduct = options.find(opt => opt.id.toString() === selectedValue);

      if (!selectedTypeProduct) return; // Protección extra

      const newProduct: ItemCreateData = {
        id: products.length + 1,
        name,
        product_price: parseFloat(price),
        returns_date: parseInt(returnDays),
        total_quantity: parseInt(totalQuantity),
        type_product: selectedTypeProduct.id,
        status_product: true,
      };

      setProducts([...products, newProduct]);

      // Limpiar formulario
      setName("");
      setReturnDays("");
      setPrice("");
      setTotalQuantity("");
      setSelectedValue(undefined); // Reinicia el select también si quieres
    }
  };

  const handleAddProducts = async () => {
    setIsSubmitting(true);

    // Obtener IDs de productos ya existentes (iniciales)
    const existingIds = initialProducts?.map(p => p.id) || [];

    // Filtrar productos que no estén en los productos iniciales
    const newProducts = products.filter(p => !existingIds.includes(p.id));

    // Crear solo los productos nuevos
    if (newProducts.length > 0) {
      await Promise.all(newProducts.map(element => createItem(element)));
    }

    updateData();
    closeModal();
  };

  const handleRemoveProduct = async (id: number) => {
    if (isSubmitting) return; // Evitar acciones mientras se está enviando

    try {
      setProducts(products.filter(product => product.id !== id));
      await deleteProduct(id);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPrice = products.reduce((sum, product) => sum + (product.product_price * product.total_quantity), 0).toFixed(2);
  const totalItems = products.reduce((sum, product) => sum + product.total_quantity, 0);

  const fetchTypeProducts = async () => {
    try {
      const res = await getTypeProducts();
      const filtered = res.filter((opt) => opt.type === type);

      setOptions(filtered);

      if (filtered.length === 1) {
        setSelectedValue(filtered[0].id.toString()); // auto-select
      }
    } catch (error) {
      console.error("Error al cargar opciones", error);
    }
  };

  useEffect(() => {
    fetchTypeProducts();
  }, []);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      const convertedProducts: ItemCreateData[] = initialProducts.map((p) => ({
        id: p.id,
        name: p.name,
        product_price: p.product_price,
        returns_date: p.returns_date,
        total_quantity: p.total_quantity,
        type_product: p.type_product?.id ?? null, // convertir a número
        status_product: p.status_product,
      }));

      setProducts((prevProducts) => {
        const newProducts = convertedProducts.filter(
          (newProduct) => !prevProducts.some((p) => p.id === newProduct.id)
        );
        return [...prevProducts, ...newProducts];
      });
    }
  }, [initialProducts]);


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-[52rem] max-h-[90vh] overflow-y-auto relative shadow-xl border-0">
          {/* Botón X para cerrar */}
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 text-white hover:text-red-300 z-10"
          >
            <X className="h-5 w-5" />
          </button>

          <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Package className="h-6 w-6" />
              Asignar para hoy
            </CardTitle>
            <CardDescription className="text-blue-100">
              Añade los artículos que deseas asignar
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 px-6">
            <div className="mb-3">
              <Label htmlFor="name" className="text-sm font-medium">Nombre del producto</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingrese nombre del producto"
                className="mt-1"
                required
              />
            </div>

            {/* Grid del formulario */}
            <div className="grid grid-cols-6 gap-4 mb-6">
              {/* Select arriba */}
              <div className="col-span-2">
                <Label htmlFor="returns_date" className="text-sm font-medium">Tipo</Label>
                <Select value={selectedValue} onValueChange={setSelectedValue} disabled={options.length === 1}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id.toString()}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="total_quantity" className="text-sm font-medium">Cantidad</Label>
                <Input
                  id="total_quantity"
                  type="number"
                  min="1"
                  value={totalQuantity}
                  onChange={(e) => setTotalQuantity(e.target.value)}
                  placeholder="0"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="returns_date" className="text-sm font-medium">Días devolución</Label>
                <Input
                  id="returns_date"
                  type="number"
                  min="1"
                  value={returnDays}
                  onChange={(e) => setReturnDays(e.target.value)}
                  placeholder="Días"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="price" className="text-sm font-medium">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="S/. 0.00"
                  className="mt-1"
                  required
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleAddSingleProduct}
                  className="bg-blue-800 hover:bg-blue-900 w-full"
                  disabled={!name || !returnDays || !price || !totalQuantity}
                >
                  <Plus className="h-4 w-4 mr-1" /> Guardar
                </Button>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="mb-4 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="border rounded-xl border-gray-200 shadow-sm bg-white overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-medium text-gray-700 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Productos seleccionados
                  </h3>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                      {products.length} productos
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                      <Hash className="h-3 w-3 mr-1" /> {totalItems} unidades
                    </Badge>
                  </div>
                </div>

                {products.length > 0 ? (
                  <ScrollArea className="h-64">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="w-[40px]">#</TableHead>
                          <TableHead>Producto</TableHead>
                          <TableHead className="text-center">Cantidad</TableHead>
                          <TableHead className="text-center">Días devolución</TableHead>
                          <TableHead className="text-right">Precio Unit.</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                          <TableHead className="w-[80px] text-right">Acción</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.id}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary">
                                {product.total_quantity}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                <Calendar className="mr-1 h-3 w-3" />
                                {product.returns_date} días
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              <span className="flex items-center justify-end">
                                S/.
                                {Number(product.product_price).toFixed(2)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-bold text-blue-800">
                              <span className="flex items-center justify-end">
                                S/.
                                {(Number(product.product_price) * Number(product.total_quantity)).toFixed(2)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRemoveProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Package className="h-10 w-10 text-gray-300 mb-2" />
                    <p className="text-gray-500">No hay productos seleccionados</p>
                    <p className="text-gray-400 text-sm mt-1">Añade productos usando el formulario superior</p>
                  </div>
                )}

                {products.length > 0 && (
                  <div className="p-4 bg-blue-50 border-t border-blue-100 flex justify-between items-center">
                    <span className="font-medium text-gray-700 flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {totalItems} unidades listas para asignar
                    </span>
                    <span className="font-bold text-blue-800 flex items-center">
                      Total: S/. {totalPrice}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 bg-gray-50 border-t py-5">
            <Button
              variant="outline"
              onClick={closeModal}
              disabled={isSubmitting}
              className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
            >
              <Ban className="mr-2 h-4 w-4" /> Cancelar
            </Button>
            <Button
              disabled={isSubmitting}
              className="bg-blue-800 hover:bg-blue-900"
              onClick={handleAddProducts}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Guardando..." : "Guardar asignaciones"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

export default AssignmentModal;