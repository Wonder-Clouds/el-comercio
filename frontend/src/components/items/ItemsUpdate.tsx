import { updateItem } from "@/api/Product.api";
import { Button } from "../ui/button";
import { Ban, Save } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Item, ItemCreateData } from "@/models/Product";
import { useState } from "react";

interface ItemsUpdateProps {
  closeModal: () => void;
  updateData: () => void;
  item: Item;
}

const ItemsUpdate = ({ closeModal, updateData, item }: ItemsUpdateProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado local para manejar los cambios en el formulario
  const [formData, setFormData] = useState<Item>({
    ...item
  });

  console.log("Item to update:", item);

  // Función para manejar cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [id]: type === 'number' ? Number(value) : value
    }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Preparar el payload con solo el ID de type_product
      const payload: ItemCreateData = {
        ...formData,
        type_product: formData.type_product?.id ?? null
      };

      await updateItem(payload);
      updateData(); // Actualizar la lista después de editar
      closeModal(); // Cerrar el modal
    } catch (error) {
      console.error("Error editing item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-[35rem] mx-4 bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Actualizar producto</h2>
          <p className="text-sm text-gray-600">Aquí puedes actualizar los datos del producto.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Nombre"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="product_price">Precio</Label>
              <Input
                id="product_price"
                type="number"
                step="0.01"
                placeholder="Precio"
                value={formData.product_price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="returns_date">Días de devolución</Label>
              <Input
                id="returns_date"
                type="number"
                placeholder="Días de devolución"
                value={formData.returns_date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="total_quantity">Cantidad total</Label>
              <Input
                id="total_quantity"
                type="number"
                placeholder="Cantidad total"
                value={formData.total_quantity}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-x-4 mt-6">
            <Button
              type="button"
              variant="outline"
              className="bg-red-500 text-white hover:bg-red-400 hover:text-white"
              onClick={closeModal}
              disabled={isSubmitting}
            >
              <Ban className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemsUpdate;