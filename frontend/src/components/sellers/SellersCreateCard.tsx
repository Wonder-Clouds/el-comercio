import React, { useState } from 'react';
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Ban, Save } from "lucide-react";
import { createSeller } from "@/api/Seller.api.ts";
import { Label } from "@/components/ui/label.tsx";
import { defaultSeller, Seller } from "@/models/Seller.ts";
import { useToast } from "@/hooks/use-toast.ts";

const CreateCard = ({ closeModal, updateData }: { closeModal: () => void, updateData: () => void }) => {
  const [formData, setFormData] = useState<Seller>(defaultSeller);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setFormErrors({ ...formErrors, [id]: "" });
  };

  const handleStatusChange = (value: string) => {
    setFormData({ ...formData, status: value === "true" });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.number_seller) errors.number_seller = "El código del vendedor es obligatorio";
    if (!formData.name) errors.name = "El nombre es obligatorio";
    if (!formData.last_name) errors.last_name = "El apellido es obligatorio";
    if (!formData.dni) errors.dni = "El DNI es obligatorio";
    else if (formData.dni.length !== 8) errors.dni = "El DNI debe tener 8 dígitos";
    if (!formData.phone) errors.phone = "El número de celular es obligatorio";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await createSeller(formData);
      toast({
        title: "Éxito",
        description: "Vendedor creado exitosamente",
        variant: "default"
      });
      updateData();
      closeModal();
    } catch (error) {
      console.error("Error al crear el vendedor", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al crear el vendedor",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-[35rem]">
        <CardHeader>
          <CardTitle className="text-2xl">Crear vendedor</CardTitle>
          <CardDescription>Aquí puedes crear un vendedor.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-5">
              {[
                { id: "number_seller", label: "Código Único" },
                { id: "name", label: "Nombre" },
                { id: "last_name", label: "Apellidos" },
                { id: "dni", label: "DNI", placeholder: "Debe tener 8 dígitos", maxLength: 8 },
                { id: "phone", label: "Celular", placeholder: "ej. 999 999 999" }
              ].map(({ id, label, placeholder, maxLength }) => (
                <div key={id} className="flex flex-col space-y-2">
                  <Label htmlFor={id}>{label}</Label>
                  <Input
                    className="p-2"
                    id={id}
                    placeholder={placeholder}
                    value={formData[id as keyof Seller] as string}
                    maxLength={maxLength}
                    onChange={handleChange}
                  />
                  {formErrors[id] && (
                    <span className="text-red-500 text-sm">{formErrors[id]}</span>
                  )}
                </div>
              ))}

              <div className="flex flex-col space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select onValueChange={handleStatusChange} defaultValue="true">
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="true">Activo</SelectItem>
                    <SelectItem value="false">No Activo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-x-4">
          <Button
            variant="outline"
            className="bg-red-500 text-white hover:bg-red-400 hover:text-white"
            onClick={closeModal}
            disabled={isSubmitting}
          >
            <Ban className="mr-1" />
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            <Save className="mr-1" />
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateCard;
