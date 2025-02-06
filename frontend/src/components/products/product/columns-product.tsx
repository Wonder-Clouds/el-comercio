import { Product, ProductType } from "@/models/Product";
import { ColumnDef } from "@tanstack/react-table";
import EditableCell from "../../assignments/editable-cell";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

/**
 * Genera las columnas de la tabla de productos.
 *
 * @param onValueChange Función para actualizar valores editables.
 * @param onEdit Función que se llama al hacer clic en el botón de editar.
 * @param onDelete Función que se llama al hacer clic en el botón de eliminar.
 */
export const columnsProduct = (
  onValueChange: (assignmentId: number, productId: number, value: number | string) => void,
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
            onValueChange={(newValue) => onValueChange(product.id, product.id, newValue)}
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
            onValueChange={(newValue) => onValueChange(product.id, product.id, newValue as string)}
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
            onValueChange={(newValue) => onValueChange(product.id, product.id, newValue as number)}
          />
        );
      },
    },
    {
      accessorKey: "product_price",
      header: "Precio producto",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <EditableCell
            value={product.product_price}
            onValueChange={(newValue) => onValueChange(product.id, product.id, newValue as number)}
          />
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
