import { Item } from "@/models/Product";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";

/**
 * Genera las columnas de la tabla de periódicos.
 * 
 * Ahora la edición directa en celdas se ha deshabilitado; la única forma de editar o eliminar
 * es a través de los botones en la columna "Acciones".
 *
 * @param onEdit Función que se llama al hacer clic en el botón de editar.
 * @param onDelete Función que se llama al hacer clic en el botón de eliminar.
 */
export const columnsNewspaper = (
  onEdit: (product: Item) => void,
  onDelete: (product: Item) => void
): ColumnDef<Item>[] => {
  return [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => {
        const product = row.original;
        return <span>{product.name}</span>;
      },
    },
    {
      accessorKey: "returns_date",
      header: "Días de devolución",
      cell: ({ row }) => {
        const product = row.original;
        return <span>{product.returns_date}</span>;
      },
    },
    {
      accessorKey: "product_price",
      header: "Precio producto",
      cell: ({ row }) => {
        const product = row.original;
        return <span>{product.product_price}</span>;
      },
    },
    {
      id: "status_product",
      header: "Estado",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-semibold ${product.status_product ? "text-green-500" : "text-red-500"
                }`}
            >
              {product.status_product ? "Activo" : "Inactivo"}
            </span>
            {product.status_product ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex gap-2">
            <Button onClick={() => onEdit(product)} variant="outline" size="icon">
              <Pencil className="w-4 h-4" />
            </Button>
            <Button onClick={() => onDelete(product)} variant="outline" size="icon">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];
};
