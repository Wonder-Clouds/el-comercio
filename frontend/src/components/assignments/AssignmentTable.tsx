import React, { RefObject, useState, useEffect, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { columns } from './columns'; 
import { Assignment } from '@/models/Assignment';
import { postDetailAssignments } from '@/api/DetailAssignment.api';
import { AssignmentStatus, PostDetailAssignment } from '@/models/DetailAssignment';
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
  data: initialData, 
  products, 
  page, 
  pageSize, 
  totalCount, 
  onPageChange, 
  tableRef,
  tableType
}) => {
  // Estado local para mantener los datos actualizados
  const [data, setData] = useState<Assignment[]>(initialData);
  
  // Actualizar datos cuando cambian las props
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Función para calcular el stock disponible de cada producto
  const getAvailableStock = (productId: number): number => {
    const product = products.find(p => p.id === productId);
    if (!product) return 0;

    // Calcular el total usado de este producto en todas las asignaciones
    const totalUsed = data.reduce((total, assignment) => {
      const detail = assignment.detail_assignments?.find(d => d.product.id === productId);
      return total + (detail?.quantity || 0);
    }, 0);

    // Retornar el stock disponible
    return Math.max(0, product.total_quantity - totalUsed);
  };

  const handleValueChange = async (assignmentId: number, productId: number, value: number) => {
    // Calcular el stock disponible considerando el cambio
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const totalUsedByOthers = data.reduce((total, assignment) => {
      if (assignment.id === assignmentId) return total; // Excluir la asignación actual
      const detail = assignment.detail_assignments?.find(d => d.product.id === productId);
      return total + (detail?.quantity || 0);
    }, 0);

    const availableStock = product.total_quantity - totalUsedByOthers;
    
    if (value > availableStock) {
      alert(`No hay suficiente stock. Disponible: ${availableStock}, Solicitado: ${value}`);
      return;
    }

    // Actualizar el estado local inmediatamente
    setData(prevData => {
      return prevData.map(assignment => {
        if (assignment.id === assignmentId) {
          // Crear una copia profunda para evitar mutar el estado directamente
          const updatedAssignment = { ...assignment };
          
          // Si detail_assignments no existe, inicializarlo como array vacío
          if (!updatedAssignment.detail_assignments) {
            updatedAssignment.detail_assignments = [];
          }
          
          // Buscar si ya existe un detalle para este producto
          const existingDetailIndex = updatedAssignment.detail_assignments.findIndex(
            d => d.product.id === productId
          );
          
          if (existingDetailIndex >= 0) {
            // Actualizar el detalle existente
            const updatedDetails = [...updatedAssignment.detail_assignments];
            updatedDetails[existingDetailIndex] = {
              ...updatedDetails[existingDetailIndex],
              quantity: value
            };
            updatedAssignment.detail_assignments = updatedDetails;
          } else {
            // Si no existe, crear un nuevo detalle
            // Buscar el producto en la lista de productos
            const product = products.find(p => p.id === productId);
            if (product) {
              updatedAssignment.detail_assignments.push({
                id: 0,
                product,
                quantity: value,
                assignment: updatedAssignment,
                returned_amount: 0,
                unit_price: 0,
                status: AssignmentStatus.PENDING,
                return_date: new Date().toString(),
                date_assignment: new Date().toString(),
              });
            }
          }
          
          return updatedAssignment;
        }
        return assignment;
      });
    });
    
    // Enviar al servidor
    const postData: PostDetailAssignment = {
      product_id: productId,
      assignment_id: assignmentId,
      quantity: value
    };
    
    try {
      await postDetailAssignments(postData);
    } catch (error) {
      console.error('Error al actualizar:', error);
      // Si hay error, revertir el cambio
      setData(initialData);
      alert('Error al guardar los cambios. Se han revertido las modificaciones.');
    }
  };

  // Función para imprimir el reporte individual
  const handlePrintRow = (row: Assignment) => {
    if (!row.detail_assignments) return;
  
    const filteredDetails = row.detail_assignments.filter(
      d => (d.product.type?.toLowerCase() || "") === tableType
    );
  
    const date = new Date().toLocaleString();
  
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: 'Courier New', Courier, monospace; padding: 16px; width: 300px; border: 1px dashed #000;">
        <h2 style="text-align: center; margin-bottom: 8px;">🧾 COMPROBANTE DE ENTREGA</h2>
        <p style="margin: 0;"><strong>Fecha:</strong> ${date}</p>
        <p style="margin: 0;"><strong>Código Vendedor:</strong> ${row.seller.number_seller}</p>
        <p style="margin: 0;"><strong>Nombre:</strong> ${row.seller.name} ${row.seller.last_name}</p>
        <hr style="margin: 8px 0;">
        <h3 style="margin-bottom: 4px;">Detalle de Productos</h3>
        <table style="width: 100%; font-size: 14px;">
          <thead>
            <tr>
              <th style="text-align: left;">Producto</th>
              <th style="text-align: right;">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            ${filteredDetails.map(d => `
              <tr>
                <td>${d.product.name}</td>
                <td style="text-align: right;">${d.quantity}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <hr style="margin: 8px 0;">
        <p style="text-align: center; margin-top: 12px;">Gracias por su preferencia</p>
      </div>
    `;
  
    printElement(element, `Comprobante_${row.seller.number_seller}`);
  };

  // Calcular los totales para cada columna de producto
  const productTotals = useMemo(() => {
    const totals: { [key: number]: number } = {};
    
    // Inicializar totales para cada producto
    products.forEach(product => {
      totals[product.id] = 0;
    });
    
    // Sumar las cantidades de cada producto
    data.forEach(assignment => {
      if (assignment.detail_assignments) {
        assignment.detail_assignments.forEach(detail => {
          if (totals[detail.product.id] !== undefined) {
            totals[detail.product.id] += detail.quantity || 0;
          }
        });
      }
    });
    
    return totals;
  }, [data, products]);

  // Calcular stock restante para mostrar en los totales
  const remainingStock = useMemo(() => {
    const remaining: { [key: number]: number } = {};
    
    products.forEach(product => {
      const totalUsed = productTotals[product.id] || 0;
      remaining[product.id] = Math.max(0, product.total_quantity - totalUsed);
    });
    
    return remaining;
  }, [products, productTotals]);

  const table = useReactTable({
    data,
    columns: [
      ...columns(products, handleValueChange, getAvailableStock),
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
          {/* Fila de totales */}
          <tr className="bg-gray-50 font-medium border-t-2 border-gray-300">
            <td className="px-6 py-4 whitespace-nowrap font-bold">TOTAL USADO</td>
            <td className="px-6 py-4 whitespace-nowrap"></td>
            <td className="px-6 py-4 whitespace-nowrap"></td>
            {/* Celdas para cada producto */}
            {products.map(product => (
              <td key={`total-${product.id}`} className="px-6 py-4 whitespace-nowrap text-center">
                <div className="font-bold">{productTotals[product.id] || 0}</div>
                <div className="text-xs text-gray-500">
                  Restante: {remainingStock[product.id]}
                </div>
              </td>
            ))}
            {/* Celda vacía para la columna de acciones */}
            <td className="px-6 py-4 whitespace-nowrap action-column"></td>
          </tr>
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