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
import { Product, ProductType } from "@/models/Product"; // Importa sin 'type'

/**
 * Se define un tipo auxiliar para el formulario en el que los campos numéricos se manejan como string.
 */
type ProductForm = Omit<
  Product,
  "returns_date" |
    "monday_price" |
    "tuesday_price" |
    "wednesday_price" |
    "thursday_price" |
    "friday_price" |
    "saturday_price" |
    "sunday_price" |
    "type"
> & {
  returns_date: string;
  monday_price: string;
  tuesday_price: string;
  wednesday_price: string;
  thursday_price: string;
  friday_price: string;
  saturday_price: string;
  sunday_price: string;
  type: string;
};

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
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializa el estado del formulario convirtiendo los campos numéricos a string
  const [formData, setFormData] = useState<ProductForm>({
    ...productData,
    returns_date: productData.returns_date.toString(),
    monday_price: productData.monday_price.toString(),
    tuesday_price: productData.tuesday_price.toString(),
    wednesday_price: productData.wednesday_price.toString(),
    thursday_price: productData.thursday_price.toString(),
    friday_price: productData.friday_price.toString(),
    saturday_price: productData.saturday_price.toString(),
    sunday_price: productData.sunday_price.toString(),
    type: "NEWSPAPER",
  });

  // Actualiza el formulario si productData cambia
  useEffect(() => {
    setFormData({
      ...productData,
      returns_date: productData.returns_date.toString(),
      monday_price: productData.monday_price.toString(),
      tuesday_price: productData.tuesday_price.toString(),
      wednesday_price: productData.wednesday_price.toString(),
      thursday_price: productData.thursday_price.toString(),
      friday_price: productData.friday_price.toString(),
      saturday_price: productData.saturday_price.toString(),
      sunday_price: productData.sunday_price.toString(),
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

      // Construye el objeto Product convirtiendo los campos numéricos a number.
      const updatedProduct: Product = {
        ...productData,
        name: formData.name,
        returns_date: Number(formData.returns_date),
        monday_price: Number(formData.monday_price),
        tuesday_price: Number(formData.tuesday_price),
        wednesday_price: Number(formData.wednesday_price),
        thursday_price: Number(formData.thursday_price),
        friday_price: Number(formData.friday_price),
        saturday_price: Number(formData.saturday_price),
        sunday_price: Number(formData.sunday_price),
        status_product: formData.status_product,
        type: ProductType.NEWSPAPER, // Usa ProductType como valor
      };

      await updateProduct(updatedProduct);
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
              {/* Campos de precios diarios */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="monday_price">Precio Lunes</Label>
                  <Input
                    id="monday_price"
                    placeholder="Precio Lunes"
                    value={formData.monday_price}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="tuesday_price">Precio Martes</Label>
                  <Input
                    id="tuesday_price"
                    placeholder="Precio Martes"
                    value={formData.tuesday_price}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="wednesday_price">Precio Miércoles</Label>
                  <Input
                    id="wednesday_price"
                    placeholder="Precio Miércoles"
                    value={formData.wednesday_price}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="thursday_price">Precio Jueves</Label>
                  <Input
                    id="thursday_price"
                    placeholder="Precio Jueves"
                    value={formData.thursday_price}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="friday_price">Precio Viernes</Label>
                  <Input
                    id="friday_price"
                    placeholder="Precio Viernes"
                    value={formData.friday_price}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="saturday_price">Precio Sábado</Label>
                  <Input
                    id="saturday_price"
                    placeholder="Precio Sábado"
                    value={formData.saturday_price}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="sunday_price">Precio Domingo</Label>
                  <Input
                    id="sunday_price"
                    placeholder="Precio Domingo"
                    value={formData.sunday_price}
                    onChange={handleChange}
                  />
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
            <Ban className="mr-2" /> Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            <Save className="mr-2" /> {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  );
};

export default UpdateNewspaperCard;
