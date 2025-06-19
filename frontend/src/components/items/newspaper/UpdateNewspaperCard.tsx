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
import { Item, ProductType } from "@/models/Product";

/**
 * Se define un tipo auxiliar para el formulario en el que los campos numéricos se manejan como string.
 */
type NewspaperForm = Omit<
  Item,
  "returns_date" |
  "type"
> & {
  returns_date: string;
  type: string;
};

interface UpdateNewspaperCardProps {
  closeModal: () => void;
  updateData: () => void;
  productData: Item;
}

const UpdateNewspaperCard = ({
  closeModal,
  updateData,
  productData,
}: UpdateNewspaperCardProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializa el estado del formulario convirtiendo los campos numéricos a string
  const [formData, setFormData] = useState<NewspaperForm>({
    ...productData,
    returns_date: productData.returns_date.toString(),
    type: "NEWSPAPER",
  });

  // Actualiza el formulario si productData cambia
  useEffect(() => {
    setFormData({
      ...productData,
      returns_date: productData.returns_date.toString(),
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
      !formData.name.trim() ||
      !formData.returns_date
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

      // Construye el objeto Product convirtiendo los campos numéricos a number.
      const updatedNewspaper: Item = {
        ...productData,
        name: formData.name,
        returns_date: Number(formData.returns_date),
        product_price: formData.product_price,
        status_product: formData.status_product,
        type: ProductType.NEWSPAPER,
        total_quantity: formData.total_quantity,
      };

      await updateItem(updatedNewspaper);
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
          <CardDescription>
            Aquí puedes actualizar los datos del periódico.
          </CardDescription>
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

export default UpdateNewspaperCard;
