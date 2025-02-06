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
import { updateProduct } from "@/api/Product.api";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/models/Product";

interface UpdateNewspaperCardProps {
  closeModal: () => void;
  updateData: () => void;
  productData: Product;
}

const UpdateNewspaperCard = ({
  closeModal,
  updateData,
  productData,
}: UpdateNewspaperCardProps) => {
  const [formData, setFormData] = useState<Product>({
    ...productData,
    type: "NEWSPAPER",
    // Se elimina product_price
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFormData({
      ...productData,
      type: "NEWSPAPER",
    });
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
    if (
      !formData.name ||
      !formData.returns_date ||
      formData.monday_price === "" ||
      formData.tuesday_price === "" ||
      formData.wednesday_price === "" ||
      formData.thursday_price === "" ||
      formData.friday_price === "" ||
      formData.saturday_price === "" ||
      formData.sunday_price === ""
    ) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsSubmitting(true);
      await updateProduct(formData);
      toast({
        title: "Éxito",
        description: "Periódico actualizado exitosamente",
        variant: "default",
      });
      updateData();
      closeModal();
    } catch (error) {
      console.error("Error al actualizar el periódico", error);
      toast({
        title: "Error",
        description: "Error al actualizar el periódico",
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
          <CardTitle className="text-2xl">Actualizar Periódico</CardTitle>
          <CardDescription>Aquí puedes actualizar los datos del periódico.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full gap-4">
              {/* Campo Nombre */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" placeholder="Nombre" value={formData.name} onChange={handleChange} />
              </div>
              {/* Campo Días de devolución */}
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
              {/* Campos de precios diarios */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="monday_price">Precio Lunes</Label>
                  <Input id="monday_price" placeholder="Precio Lunes" value={formData.monday_price} onChange={handleChange} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="tuesday_price">Precio Martes</Label>
                  <Input id="tuesday_price" placeholder="Precio Martes" value={formData.tuesday_price} onChange={handleChange} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="wednesday_price">Precio Miércoles</Label>
                  <Input id="wednesday_price" placeholder="Precio Miércoles" value={formData.wednesday_price} onChange={handleChange} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="thursday_price">Precio Jueves</Label>
                  <Input id="thursday_price" placeholder="Precio Jueves" value={formData.thursday_price} onChange={handleChange} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="friday_price">Precio Viernes</Label>
                  <Input id="friday_price" placeholder="Precio Viernes" value={formData.friday_price} onChange={handleChange} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="saturday_price">Precio Sábado</Label>
                  <Input id="saturday_price" placeholder="Precio Sábado" value={formData.saturday_price} onChange={handleChange} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="sunday_price">Precio Domingo</Label>
                  <Input id="sunday_price" placeholder="Precio Domingo" value={formData.sunday_price} onChange={handleChange} />
                </div>
              </div>
              {/* Campo Estado */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="status_product">Estado del Periódico</Label>
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
      <Toaster />
    </div>
  );
};

export default UpdateNewspaperCard;
