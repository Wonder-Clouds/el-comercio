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
  ChevronsRight,
  ChevronsLeft,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "motion/react";
import { Item } from "@/models/Product";
import { getActiveItems } from "@/api/Product.api";
import { Types } from "@/models/TypeProduct";

interface AssignmentModalProps {
  type: Types;
  closeModal: () => void;
  updateData: (selectedItems: number[]) => void;
  initialProducts?: Item[];
  otherProducts?: Item[];
}

const AssignmentModal = ({
  type,
  closeModal,
  updateData,
  initialProducts,
  otherProducts
}: AssignmentModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [disponibles, setDisponibles] = useState<Item[]>([]);
  const [seleccionados, setSeleccionados] = useState<Item[]>([]);

  const [marcadosDisponibles, setMarcadosDisponibles] = useState<number[]>([]);
  const [marcadosSeleccionados, setMarcadosSeleccionados] = useState<number[]>([]);

  const [searchDisponibles, setSearchDisponibles] = useState("");
  const [searchSeleccionados, setSearchSeleccionados] = useState("");

  const fetchItems = async () => {
    const response = await getActiveItems(1, 500, type);
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

  // Nuevas funciones para mover todos
  const moverTodosASeleccionados = () => {
    setSeleccionados(prev => [...prev, ...disponibles]);
    setDisponibles([]);
    setMarcadosDisponibles([]);
  };

  const moverTodosADisponibles = () => {
    setDisponibles(prev => [...prev, ...seleccionados]);
    setSeleccionados([]);
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
      const idsSeleccionados = seleccionados.map(item => item.id);
      const idsOtros = otherProducts?.map(item => item.id) ?? [];

      const idsFinales = [...idsSeleccionados, ...idsOtros];

      updateData(idsFinales);
      closeModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <Card className="w-[60rem] max-w-5xl shadow-xl border-0 relative">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 bg-white rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>

          <CardHeader className="bg-primary text-white">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Package className="h-6 w-6" />
              Asignar productos
            </CardTitle>
            <CardDescription className="text-blue-100">
              Selecciona los productos que deseas asignar
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <div className="flex gap-4 items-stretch">
              {/* DISPONIBLES */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-gray-700">
                    Disponibles
                  </h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {disponibles.length}
                  </span>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg flex flex-col h-[450px] shadow-sm">
                  {/* Buscador mejorado */}
                  <div className="p-3 border-b bg-gray-50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        placeholder="Buscar productos..."
                        value={searchDisponibles}
                        onChange={e => setSearchDisponibles(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all"
                      />
                    </div>
                  </div>

                  {/* Lista con estados vacíos */}
                  <div className="flex-1 overflow-y-auto">
                    {disponiblesFiltrados.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
                        <Package className="h-12 w-12 mb-2 opacity-50" />
                        <p className="text-sm">
                          {searchDisponibles
                            ? "No se encontraron productos"
                            : "No hay productos disponibles"}
                        </p>
                      </div>
                    ) : (
                      <AnimatePresence mode="popLayout">
                        {disponiblesFiltrados.map(item => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onClick={() => toggleMarcadoDisponible(item.id)}
                            className={`px-4 py-3 cursor-pointer border-b border-gray-100 transition-all ${marcadosDisponibles.includes(item.id)
                              ? "bg-primary text-white shadow-sm"
                              : "hover:bg-blue-50 text-gray-700"
                              }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${marcadosDisponibles.includes(item.id)
                                ? "bg-white border-white"
                                : "border-gray-300"
                                }`}>
                                {marcadosDisponibles.includes(item.id) && (
                                  <div className="w-2 h-2 bg-primary rounded-sm" />
                                )}
                              </div>
                              <span className="text-sm">{item.name}</span>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>

                  {/* Contador de seleccionados */}
                  {marcadosDisponibles.length > 0 && (
                    <div className="p-2 bg-blue-50 border-t border-blue-200 text-xs text-primary text-center">
                      {marcadosDisponibles.length} seleccionado{marcadosDisponibles.length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>

              {/* BOTONES MEJORADOS */}
              <div className="flex flex-col gap-2 justify-center">
                <Button
                  onClick={moverTodosASeleccionados}
                  disabled={disponibles.length === 0}
                  variant="outline"
                  size="sm"
                  className="h-10 w-10"
                  title="Mover todos"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
                <Button
                  onClick={moverASeleccionados}
                  disabled={marcadosDisponibles.length === 0}
                  size="sm"
                  className="h-10 w-10"
                  title="Mover seleccionados"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <div className="h-4" /> {/* Separador */}

                <Button
                  onClick={moverADisponibles}
                  disabled={marcadosSeleccionados.length === 0}
                  size="sm"
                  className="h-10 w-10"
                  title="Regresar seleccionados"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  onClick={moverTodosADisponibles}
                  disabled={seleccionados.length === 0}
                  variant="outline"
                  size="sm"
                  className="h-10 w-10"
                  title="Regresar todos"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
              </div>

              {/* SELECCIONADOS */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-gray-700">
                    Seleccionados
                  </h2>
                  <span className="text-sm text-white bg-primary px-2 py-1 rounded-full">
                    {seleccionados.length}
                  </span>
                </div>

                <div className="bg-white border-2 border-blue-300 rounded-lg flex flex-col h-[450px] shadow-sm">
                  <div className="p-3 border-b bg-blue-50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        placeholder="Buscar productos..."
                        value={searchSeleccionados}
                        onChange={e => setSearchSeleccionados(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {seleccionadosFiltrados.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
                        <Package className="h-12 w-12 mb-2 opacity-50" />
                        <p className="text-sm">
                          {searchSeleccionados
                            ? "No se encontraron productos"
                            : "Ningún producto seleccionado"}
                        </p>
                      </div>
                    ) : (
                      <AnimatePresence mode="popLayout">
                        {seleccionadosFiltrados.map(item => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onClick={() => toggleMarcadoSeleccionado(item.id)}
                            className={`px-4 py-3 cursor-pointer border-b border-gray-100 transition-all ${marcadosSeleccionados.includes(item.id)
                              ? "bg-primary text-white shadow-sm"
                              : "hover:bg-blue-50 text-gray-700"
                              }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${marcadosSeleccionados.includes(item.id)
                                ? "bg-white border-white"
                                : "border-gray-300"
                                }`}>
                                {marcadosSeleccionados.includes(item.id) && (
                                  <div className="w-2 h-2 bg-primary rounded-sm" />
                                )}
                              </div>
                              <span className="text-sm">{item.name}</span>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>

                  {marcadosSeleccionados.length > 0 && (
                    <div className="p-2 bg-blue-50 border-t border-blue-200 text-xs text-primary text-center">
                      {marcadosSeleccionados.length} seleccionado{marcadosSeleccionados.length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center bg-gray-50 border-t p-5">
            <p className="text-sm text-gray-600">
              {seleccionados.length} producto{seleccionados.length !== 1 ? 's' : ''} seleccionado{seleccionados.length !== 1 ? 's' : ''}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={closeModal}>
                <Ban className="h-4 w-4" />
                Cancelar
              </Button>
              <Button
                onClick={handleAddProductsToAssignment}
                disabled={isSubmitting || seleccionados.length === 0}
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default AssignmentModal;