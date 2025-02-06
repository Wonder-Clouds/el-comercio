import React, { RefObject } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { columns } from './columns'; // La función columns recibe solo (products, onValueChange)
import { Assignment } from '@/models/Assignment';
import { postDetailAssignments } from '@/api/DetailAssignment.api';
import { PostDetailAssignment } from '@/models/DetailAssignment';
import { Product } from '@/models/Product';
import { ChevronLeft, ChevronRight, FileDown } from 'lucide-react';
import printElement from '@/utils/printElement';

interface TableProps {
  data: Assignment[];
  products: Product[];
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  tableRef?: RefObject<HTMLDivElement>;
  tableType: 'newspaper' | 'product';
}

const AssignmentTable: React.FC<TableProps> = ({ 
  data, 
  products, 
  page, 
  pageSize, 
  totalCount, 
  onPageChange, 
  tableRef,
  tableType
}) => {
  const handleValueChange = async (assignmentId: number, productId: number, value: number) => {
    const data: PostDetailAssignment = {
      product_id: productId,
      assignment_id: assignmentId,
      quantity: value
    };
    try {
      await postDetailAssignments(data);
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  // Función para imprimir el reporte individual de una fila filtrando los detalles según tableType
  const handlePrintRow = (row: Assignment) => {
    if (!row.detail_assignments) return;
    // Convertimos el tipo del producto a minúsculas para la comparación
    const filteredDetails = row.detail_assignments.filter(
      d => (d.product.type?.toLowerCase() || "") === tableType
    );
    const element = document.createElement('div');
    element.innerHTML = `
      <h2>Reporte Individual</h2>
      <p><strong>Código:</strong> ${row.seller.number_seller}</p>
      <p><strong>Nombre:</strong> ${row.seller.name} ${row.seller.last_name}</p>
      <h3>Productos:</h3>
      <ul>
        ${filteredDetails.map(d => `<li>${d.product.name}: ${d.quantity}</li>`).join('')}
      </ul>
    `;
    printElement(element, `Reporte_${row.seller.number_seller}`);
  };

  const table = useReactTable({
    data,
    // Se utilizan las columnas definidas en columns.tsx (sin columna de acciones)
    // y se agrega la columna de acción para la impresión individual.
    columns: [
      ...columns(products, handleValueChange),
      {
        id: "actions",
        header: () => <span className="action-column">Acciones</span>,
        cell: ({ row }: { row: { original: Assignment } }) => (
          <span className="action-column">
            <button
              onClick={() => handlePrintRow(row.original)}
              className="p-2 text-blue-600 hover:underline"
            >
              <FileDown className="w-5 h-5 inline-block" />
            </button>
          </span>
        )
      }
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div ref={tableRef} className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className={`px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50 ${header.column.id === 'actions' ? 'action-column' : ''}`}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
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
                  className={`px-6 py-4 whitespace-nowrap ${cell.column.id === 'actions' ? 'action-column' : ''}`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}  
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col items-center justify-between px-2 mt-6 md:flex-row">
        <div className="p-4 text-sm font-medium text-gray-500">
          Página {page} de {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => page > 1 && onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-3 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
          <button
            onClick={() => page < totalPages && onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentTable;
