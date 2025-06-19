import React, { useState } from "react";
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
import { createItem } from "@/api/Product.api";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { defaultItem, Item, ProductType } from "@/models/Product";

interface CreateNewspaperCardProps {
  closeModal: () => void;
  updateData: () => void;
}

const CreateNewspaperCard = ({ closeModal, updateData }: CreateNewspaperCardProps) => {
  const initialFormData: Item = {
    ...defaultItem,
    id: 0,
    name: "",
    type: ProductType.NEWSPAPER,
    returns_date: 0,
    product_price: 0,
    status_product: true,

  };

  const [formData, setFormData] = useState<Item>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // Para el campo "name" se mantiene el string; para los demás se convierte a número.
    const newValue: string | number = id === "name" ? value : value === "" ? 0 : parseFloat(value);
    setFormData((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      status_product: e.target.value === "true",
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre es requerido",
        variant: "destructive",
      });
      return false;
    }

    if (typeof formData.returns_date !== "number" || isNaN(formData.returns_date)) {
      toast({
        title: "Error",
        description: "Días de devolución debe ser un número válido",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const formDataToSubmit: Item = {
        ...formData,
        returns_date: Number(formData.returns_date),
        product_price: 0,
        total_quantity: 0,
        type: ProductType.NEWSPAPER,
      };


      await createItem(formDataToSubmit);

      toast({
        title: "Éxito",
        description: "Periódico creado exitosamente",
        variant: "default",
      });
      updateData();
      closeModal();
    } catch (error) {
      console.error("Error al crear el periódico:", error);
      toast({
        title: "Error",
        description: "Error al crear el periódico. Por favor, intente nuevamente.",
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
          <CardTitle className="text-2xl">Crear Periódico</CardTitle>
          <CardDescription>Aquí puedes crear un periódico.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full gap-4">
              {/* Campo Nombre */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  placeholder="Nombre"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Campo Días de devolución */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="returns_date">Días de devolución</Label>
                <Input
                  id="returns_date"
                  type="number"
                  min="1"
                  placeholder="Cantidad de días"
                  value={formData.returns_date !== 0 ? formData.returns_date : ""}
                  onChange={handleChange}
                  required
                />
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
            <Ban className="mr-2" /> Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            <Save className="mr-2" /> {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateNewspaperCard;
