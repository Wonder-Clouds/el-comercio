import { Item } from "@/models/Product";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, XCircle } from "lucide-react";

export const columnsItems = (): ColumnDef<Item>[] => {
  return [
    {
      id: "index",
      header: "N°",
      size: 30,
      cell: ({ row }) => <span>{row.index + 1}</span>,
      enableSorting: false,
      enableColumnFilter: false,
    },
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
      accessorKey: "total_quantity",
      header: "Cantidad total",
      cell: ({ row }) => {
        const product = row.original;
        return <span>{product.total_quantity}</span>;
      },
    },
    {
      id: "status_product",
      header: "Estado",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-2">
            {product.status_product ? (
              <>
                <div className="relative flex">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="absolute top-0 left-0 w-5 h-5 bg-green-400 rounded-full animate-ping opacity-20" />
                </div>
                <span className="font-medium text-green-600">Activo</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-500 animate-pulse" />
                <span className="font-medium text-red-600">Inactivo</span>
              </>
            )}
          </div>
        );
      },
    }
  ];
};
