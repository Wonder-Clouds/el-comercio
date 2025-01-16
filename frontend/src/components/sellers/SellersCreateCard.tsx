import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@radix-ui/react-label";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Ban, Save} from "lucide-react";

const CreateCard = ({closeModal}: { closeModal: () => void }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Card className="w-[35rem]">
                <CardHeader>
                    <CardTitle className="text-2xl">Crear Vendedor</CardTitle>
                    <CardDescription>Aqui puedes crear un vendedor</CardDescription>
                </CardHeader>

                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Nombre</Label>
                                <Input id="name" placeholder="Nombre"/>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="last_name">Apellidos</Label>
                                <Input id="last_name" placeholder="Apellidos"/>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="dni">DNI</Label>
                                <Input id="dni" type="text" maxLength={8} placeholder="DNI"></Input>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="number_seller">Codigo del Vendedor</Label>
                                <Input id="number_seller" type="text" placeholder="Codigo del vendedor  "></Input>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="status">Estado</Label>
                                <Select>
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
                    <Button variant="outline" className="bg-red-500 text-white hover:bg-red-400 hover:text-white"
                            onClick={closeModal}><Ban/>Cancelar</Button>
                    <Button><Save/>Guardar</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default CreateCard;