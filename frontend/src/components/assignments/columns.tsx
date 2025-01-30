import { Assignment, AssignmentStatus } from "@/models/Assignment";
import { Seller } from "@/models/Seller";
import { ColumnDef } from "@tanstack/react-table";

// Definición correcta del tipo para columnas editables
export type EditableColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  editable?: boolean;
};

export const columns = (data: Assignment[]): EditableColumnDef<Assignment, Seller | Date | AssignmentStatus>[] => {
  return [
    {
      id: "number_seller",
      accessorKey: "seller.number_seller",
      header: "Código",
      editable: false,
    },
    {
      id: "name",
      accessorKey: "seller.name",
      header: "Nombre",
      editable: false,
    },
    {
      id: "last_name",
      accessorKey: "seller.last_name",
      header: "Apellido",
      editable: false,
    },
    ...(data[0]?.detail_assignments?.map((detail) => ({
      id: `quantity_${detail.product.id_product}`,
      accessorKey: `detail_assignments.${detail.product.id_product}.quantity`,
      header: detail.product.name,
      editable: true,
      cell: ({ getValue }: { getValue: () => unknown }) => {
        const value = getValue() as number;
        return value || 0;
      },
    })) || []),
  ];
};