import { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type EditableValue = string | number | boolean | Date | Record<string, unknown>;

interface AssignmentTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onUpdate: (rowIndex: number, columnId: string, value: TValue) => void
}

interface EditableCellProps<T extends EditableValue> {
  value: T
  rowIndex: number
  columnId: string
  onUpdate: (rowIndex: number, columnId: string, value: T) => void
}

const formatValue = (value: EditableValue): string => {
  if (value instanceof Date) {
    return value.toISOString().split('T')[0];
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
};

const parseValue = <T extends EditableValue>(value: string, originalValue: T): T => {
  if (originalValue instanceof Date) {
    return new Date(value) as T;
  }
  if (typeof originalValue === 'number') {
    return Number(value) as T;
  }
  if (typeof originalValue === 'boolean') {
    return (value.toLowerCase() === 'true') as T;
  }
  if (typeof originalValue === 'object') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }
  return value as T;
};

const EditableCell = <T extends EditableValue>({ 
  value: initialValue, 
  rowIndex, 
  columnId, 
  onUpdate 
}: EditableCellProps<T>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(formatValue(initialValue));

  const handleBlur = () => {
    setIsEditing(false);
    const parsedValue = parseValue(value, initialValue);
    if (parsedValue !== initialValue) {
      onUpdate(rowIndex, columnId, parsedValue);
    }
  };

  if (isEditing) {
    return (
      <input
        className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={handleBlur}
        type={initialValue instanceof Date ? "date" : "text"}
        autoFocus
      />
    );
  }

  return (
    <div 
      className="cursor-pointer hover:bg-gray-100 p-1 rounded"
      onClick={() => setIsEditing(true)}
    >
      {formatValue(initialValue)}
    </div>
  );
};
 
export function AssignmentTable<TData, TValue extends EditableValue>({
  columns,
  data: initialData,
  onUpdate,
}: AssignmentTableProps<TData, TValue>) {
  const [data, setData] = useState(initialData);

  const handleUpdate = (rowIndex: number, columnId: string, value: TValue) => {
    const newData = [...data];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [columnId]: value,
    };
    setData(newData);
    onUpdate(rowIndex, columnId, value);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
 
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow 
              key={headerGroup.id}
              className="bg-gray-50 hover:bg-gray-50"
            >
              {headerGroup.headers.map((header) => (
                <TableHead 
                  key={header.id}
                  className="py-4 px-6 text-left text-sm font-semibold text-gray-900"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, rowIndex) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="border-t border-gray-200 transition-colors hover:bg-gray-50"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell 
                    key={cell.id}
                    className="py-4 px-6 text-sm text-gray-700"
                  >
                    <EditableCell
                      value={cell.getValue() as TValue}
                      rowIndex={rowIndex}
                      columnId={cell.column.id}
                      onUpdate={handleUpdate}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell 
                colSpan={columns.length} 
                className="h-24 text-center text-sm text-gray-500"
              >
                No se encontraron resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}