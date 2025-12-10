import { Item } from "@/models/Product";
import { Assignment } from "@/models/Assignment";
import { DetailAssignment } from "@/models/DetailAssignment";
import DevolutionCell from "./devolution-cell";

export const columns = (
  products: Item[],
  onValueChange: (assignmentId: number, detailAssignmentId: number, productId: number, value: number) => void
) => {
  return [
    {
      id: "index",
      header: "N°",
      cell: ({ row }: any) => row.index + 1,
      enableSorting: false,
      enableColumnFilter: false,
      size: 40,
    },
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
    ...products.map((product) => ({
      id: `quantity_${product.id}`,
      accessorKey: `detail_assignments.${product.id}.quantity`,
      header: product.name,
      editable: true,
      cell: ({ row }: { row: { original: Assignment } }) => {
        const assignment = row.original;
        const detailAssignment = assignment.detail_assignments?.find((d) => d.product.id === product.id);

        return (
          <DevolutionCell
            assignment={assignment}
            detailAssignment={detailAssignment as DetailAssignment}
            product={product}
            onValueChange={onValueChange}
          />
        );
      },
    })),
  ];
};
