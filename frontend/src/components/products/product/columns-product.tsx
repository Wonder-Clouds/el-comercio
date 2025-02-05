import { Product, ProductType } from "@/models/Product";
import { ColumnDef } from "@tanstack/react-table";
import EditableCell from "../../assignments/editable-cell";

export const columnsProduct = (
  onValueChange: (assignmentId: number, productId: number, value: number | string) => void
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
            onValueChange={(newValue) => {
              onValueChange(product.id, product.id, newValue);
            }}
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
            onValueChange={(newValue) => {
              onValueChange(product.id, product.id, newValue as string);
            }}
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
            onValueChange={(newValue) => {
              onValueChange(product.id, product.id, newValue as number);
            }}
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
            onValueChange={(newValue) => {
              onValueChange(product.id, product.id, newValue as number);
            }}
          />
        );
      },
    }
  ];
};
