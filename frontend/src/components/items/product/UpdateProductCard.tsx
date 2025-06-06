import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Ban, Save } from "lucide-react";
import { updateItem } from "@/api/Product.api";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/models/Product";

interface UpdateProductCardProps {
  closeModal: () => void;
  updateData: () => void;
  productData: Product;
}

const UpdateProductCard = ({ closeModal, updateData, productData }: UpdateProductCardProps) => {
  const [formData, setFormData] = useState<Product>(productData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFormData(productData);
  }, [productData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      status_product: e.target.value === "true",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.returns_date || !formData.product_price) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsSubmitting(true);
      await updateItem(formData);
      toast({
        title: "Éxito",
        description: "Producto actualizado exitosamente",
        variant: "default",
      });
      updateData();
      closeModal();
    } catch (error) {
      console.error("Error al actualizar el producto", error);
      toast({
        title: "Error",
        description: "Error al actualizar el producto",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="w-[35rem]">
        <CardHeader>
          <CardTitle className="text-2xl">Actualizar Producto</CardTitle>
          <CardDescription>Aquí puedes actualizar los datos del producto.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" placeholder="Nombre" value={formData.name} onChange={handleChange} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="returns_date">Días de devolución</Label>
                <Input
                  id="returns_date"
                  type="number"
                  placeholder="Cantidad de días"
                  value={formData.returns_date}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="product_price">Precio producto</Label>
                <Input id="product_price" placeholder="Precio producto" value={formData.product_price} onChange={handleChange} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="status_product">Estado del Producto</Label>
                <select
                  id="status_product"
                  value={formData.status_product ? "true" : "false"}
                  onChange={handleStatusChange}
                  className="border rounded p-2"
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" onClick={closeModal} disabled={isSubmitting}>
            <Ban /> Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            <Save /> {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UpdateProductCard;
