import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { columns } from './columns';
import { Assignment } from '@/models/Assignment';
import { Product } from '@/models/Product';
import { DevolutionQuantity } from '@/models/Devolution';
import { postDevolution } from '@/api/Devolution.api';

interface TableProps {
  data: Assignment[];
  products: Product[]
}

const DevolutionTable: React.FC<TableProps> = ({ data, products }) => {
  const handleValueChange = async (assignmentId: number, detailAssignmentId: number, productId: number, value: number) => {
    const data: DevolutionQuantity = {
      quantity: value
    };

    try {
      await postDevolution(detailAssignmentId, data);
      console.log('Valor actualizado:', { assignmentId, detailAssignmentId, productId, value });
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  const table = useReactTable({
    data,
    columns: columns(products, handleValueChange),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap"
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DevolutionTable;