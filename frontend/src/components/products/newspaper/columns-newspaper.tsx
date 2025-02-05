import { Product, ProductType } from "@/models/Product";
import { ColumnDef } from "@tanstack/react-table";
import EditableCell from "../../assignments/editable-cell";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";

/**
 * Genera las columnas de la tabla de periódicos.
 *
 * @param onValueChange Función para actualizar valores editables.
 * @param onEdit Función que se llama al hacer clic en el botón de editar.
 * @param onDelete Función que se llama al hacer clic en el botón de eliminar.
 */
export const columnsNewspaper = (
  onValueChange: (productId: number, field: string, value: number | string | boolean) => void,
  onEdit: (product: Product) => void,
  onDelete: (product: Product) => void
): ColumnDef<Product>[] => {
  return [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <EditableCell
            value={product.name}
            onValueChange={(newValue) => onValueChange(product.id, "name", newValue)}
          />
        );
      },
    },
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <EditableCell
            value={product.type === ProductType.NEWSPAPER ? "PERIODICO" : "PRODUCTO"}
            onValueChange={(newValue) => onValueChange(product.id, "type", newValue)}
          />
        );
      },
    },
    {
      accessorKey: "returns_date",
      header: "Días de devolución",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <EditableCell
            value={product.returns_date}
            onValueChange={(newValue) =>
              onValueChange(product.id, "returns_date", Number(newValue))
            }
          />
        );
      },
    },
    {
      accessorKey: "monday_price",
      header: "Lunes",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <EditableCell
            value={product.monday_price}
            onValueChange={(newValue) =>
              onValueChange(product.id, "monday_price", newValue)
            }
          />
        );
      },
    },
    {
      accessorKey: "tuesday_price",
      header: "Martes",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <EditableCell
            value={product.tuesday_price}
            onValueChange={(newValue) =>
              onValueChange(product.id, "tuesday_price", newValue)
            }
          />
        );
      },
    },
    {
      accessorKey: "wednesday_price",
      header: "Miércoles",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <EditableCell
            value={product.wednesday_price}
            onValueChange={(newValue) =>
              onValueChange(product.id, "wednesday_price", newValue)
            }
          />
        );
      },
    },
    {
      accessorKey: "thursday_price",
      header: "Jueves",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <EditableCell
            value={product.thursday_price}
            onValueChange={(newValue) =>
              onValueChange(product.id, "thursday_price", newValue)
            }
          />
        );
      },
    },
    {
      accessorKey: "friday_price",
      header: "Viernes",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <EditableCell
            value={product.friday_price}
            onValueChange={(newValue) =>
              onValueChange(product.id, "friday_price", newValue)
            }
          />
        );
      },
    },
    {
      accessorKey: "saturday_price",
      header: "Sábado",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <EditableCell
            value={product.saturday_price}
            onValueChange={(newValue) =>
              onValueChange(product.id, "saturday_price", newValue)
            }
          />
        );
      },
    },
    {
      accessorKey: "sunday_price",
      header: "Domingo",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <EditableCell
            value={product.sunday_price}
            onValueChange={(newValue) =>
              onValueChange(product.id, "sunday_price", newValue)
            }
          />
        );
      },
    },
    // Se ha eliminado la columna "Precio producto"
    {
      id: "status_product",
      header: "Estado",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-semibold ${
                product.status_product ? "text-green-500" : "text-red-500"
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
