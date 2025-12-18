import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Ban,
  Save,
  Package,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import { Item } from "@/models/Product";
import { getItems } from "@/api/Product.api";
import { Types } from "@/models/TypeProduct";

interface AssignmentModalProps {
  type: Types;
  closeModal: () => void;
  updateData: () => void;
  initialProducts?: Item[];
}

const AssignmentModal = ({
  type,
  closeModal,
  updateData,
  initialProducts,
}: AssignmentModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [disponibles, setDisponibles] = useState<Item[]>([]);
  const [seleccionados, setSeleccionados] = useState<Item[]>([]);

  const [marcadosDisponibles, setMarcadosDisponibles] = useState<number[]>([]);
  const [marcadosSeleccionados, setMarcadosSeleccionados] = useState<number[]>([]);

  const [searchDisponibles, setSearchDisponibles] = useState("");
  const [searchSeleccionados, setSearchSeleccionados] = useState("");

  const fetchItems = async () => {
    const response = await getItems(1, 500, type);
    setDisponibles(response.results);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (initialProducts?.length) {
      setSeleccionados(initialProducts);
      setDisponibles(prev =>
        prev.filter(p => !initialProducts.some(i => i.id === p.id))
      );
    }
  }, [initialProducts]);

  const toggleMarcadoDisponible = (id: number) => {
    setMarcadosDisponibles(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleMarcadoSeleccionado = (id: number) => {
    setMarcadosSeleccionados(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const moverASeleccionados = () => {
    const items = disponibles.filter(item =>
      marcadosDisponibles.includes(item.id)
    );
    setSeleccionados(prev => [...prev, ...items]);
    setDisponibles(prev =>
      prev.filter(item => !marcadosDisponibles.includes(item.id))
    );
    setMarcadosDisponibles([]);
  };

  const moverADisponibles = () => {
    const items = seleccionados.filter(item =>
      marcadosSeleccionados.includes(item.id)
    );
    setDisponibles(prev => [...prev, ...items]);
    setSeleccionados(prev =>
      prev.filter(item => !marcadosSeleccionados.includes(item.id))
    );
    setMarcadosSeleccionados([]);
  };

  const disponiblesFiltrados = disponibles.filter(item =>
    item.name.toLowerCase().includes(searchDisponibles.toLowerCase())
  );

  const seleccionadosFiltrados = seleccionados.filter(item =>
    item.name.toLowerCase().includes(searchSeleccionados.toLowerCase())
  );

  const handleAddProductsToAssignment = async () => {
    setIsSubmitting(true);
    try {
      console.log("Productos asignados:", seleccionados);
      updateData();
      closeModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="w-[60rem] shadow-xl border-0 relative">
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 text-white hover:text-red-300"
          >
            <X className="h-5 w-5" />
          </button>

          <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Package className="h-6 w-6" />
              Asignar productos
            </CardTitle>
            <CardDescription className="text-blue-100">
              Selecciona los productos para asignar
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <div className="flex gap-6 items-center">
              {/* DISPONIBLES */}
              <div className="flex-1">
                <h2 className="font-semibold text-blue-800 mb-2">
                  Productos disponibles ({disponibles.length})
                </h2>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl flex flex-col h-[400px]">
                  <input
                    placeholder="Buscar..."
                    value={searchDisponibles}
                    onChange={e => setSearchDisponibles(e.target.value)}
                    className="m-2 px-3 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  />

                  <div className="flex-1 overflow-y-auto">
                    {disponiblesFiltrados.map(item => (
                      <div
                        key={item.id}
                        onClick={() => toggleMarcadoDisponible(item.id)}
                        className={`px-2 py-1 cursor-pointer border-b ${marcadosDisponibles.includes(item.id)
                          ? "bg-blue-900 text-white"
                          : "hover:bg-blue-100"
                          }`}
                      >
                        {item.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* BOTONES */}
              <div className="flex flex-col gap-4">
                <Button
                  onClick={moverASeleccionados}
                  disabled={!marcadosDisponibles.length}
                >
                  <ChevronRight />
                </Button>
                <Button
                  onClick={moverADisponibles}
                  disabled={!marcadosSeleccionados.length}
                >
                  <ChevronLeft />
                </Button>
              </div>

              {/* SELECCIONADOS */}
              <div className="flex-1">
                <h2 className="font-semibold text-blue-800 mb-2">
                  Productos seleccionados ({seleccionados.length})
                </h2>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl flex flex-col h-[400px]">
                  <input
                    placeholder="Buscar..."
                    value={searchSeleccionados}
                    onChange={e => setSearchSeleccionados(e.target.value)}
                    className="m-2 px-3 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  />

                  <div className="flex-1 overflow-y-auto">
                    {seleccionadosFiltrados.map(item => (
                      <div
                        key={item.id}
                        onClick={() => toggleMarcadoSeleccionado(item.id)}
                        className={`px-2 py-1 cursor-pointer border-b ${marcadosSeleccionados.includes(item.id)
                          ? "bg-blue-600 text-white"
                          : "hover:bg-blue-100"
                          }`}
                      >
                        {item.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-4 bg-gray-50 border-t p-5">
            <Button variant="outline" onClick={closeModal}>
              <Ban /> Cancelar
            </Button>
            <Button onClick={handleAddProductsToAssignment} disabled={isSubmitting}>
              <Save /> Guardar
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default AssignmentModal;
