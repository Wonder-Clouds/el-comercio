import { Product, ProductType } from "@/models/Product";
import { ColumnDef } from "@tanstack/react-table";
import EditableCell from "../../assignments/editable-cell";

export const columnsNewspaper = (
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
      accessorKey: "monday_price",
      header: "Lunes",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <EditableCell
            value={product.monday_price}
            onValueChange={(newValue) => {
              onValueChange(product.id, product.id, newValue as number);
            }}
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
            onValueChange={(newValue) => {
              onValueChange(product.id, product.id, newValue as number);
            }}
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
            onValueChange={(newValue) => {
              onValueChange(product.id, product.id, newValue as number);
            }}
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
            onValueChange={(newValue) => {
              onValueChange(product.id, product.id, newValue as number);
            }}
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
            onValueChange={(newValue) => {
              onValueChange(product.id, product.id, newValue as number);
            }}
          />
        );
      },
    },
  ];
};
