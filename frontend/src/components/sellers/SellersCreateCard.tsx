import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Ban, Save} from "lucide-react";
import {createSeller} from "@/api/Seller.api.ts";
import {toast} from "@/hooks/use-toast.ts";
import {Label} from "@/components/ui/label.tsx";


const CreateCard = ({closeModal}: { closeModal: () => void }) => {
    const [formData, setFormData] = useState({
        name: '',
        last_name: '',
        dni: '',
        number_seller: '',
        status: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleStatusChange = (value: string) => {
        setFormData({
            ...formData,
            status: value === 'true'
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.last_name || !formData.dni || !formData.number_seller) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Por favor complete todos los campos"
            });
            return;
        }

        // Validate DNI length
        if (formData.dni.length !== 8) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "El DNI debe tener 8 dígitos"
            });
            return;
        }

        try {
            setIsSubmitting(true);
            await createSeller(formData);
            toast({
                title: "Éxito",
                description: "Vendedor creado exitosamente"
            });
            closeModal();
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Error al crear el vendedor"
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Card className="w-[35rem]">
                <CardHeader>
                    <CardTitle className="text-2xl">Crear vendedor</CardTitle>
                    <CardDescription>Aqui puedes crear un vendedor.</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    placeholder="Nombre"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="last_name">Apellidos</Label>
                                <Input
                                    id="last_name"
                                    placeholder="Apellidos"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="dni">DNI</Label>
                                <Input
                                    id="dni"
                                    type="text"
                                    maxLength={8}
                                    placeholder="DNI"
                                    value={formData.dni}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="number_seller">Codigo del Vendedor</Label>
                                <Input
                                    id="number_seller"
                                    type="text"
                                    placeholder="Codigo del vendedor"
                                    value={formData.number_seller}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="status">Estado</Label>
                                <Select onValueChange={handleStatusChange} defaultValue="true">
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Seleccionar"/>
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
                        <Ban/>Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        <Save/>
                        {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default CreateCard;