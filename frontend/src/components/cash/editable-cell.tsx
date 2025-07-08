import React, { useState, useEffect } from 'react';

interface EditableCellProps {
  value: number;
  onValueChange: (value: number) => void;
}

const EditableCell = ({
  value: initialValue,
  onValueChange,
}: EditableCellProps) => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Solo actualizar si no estamos editando
    if (!isEditing) {
      setValue(initialValue);
    }
  }, [initialValue, isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    // Validar que el valor sea un número válido
    const numValue = isNaN(value) ? 0 : value;
    if (numValue !== initialValue) {
      onValueChange(numValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    setValue(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLInputElement).blur();
    } else if (e.key === 'Escape') {
      // Cancelar edición
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  const handleClick = () => {
    console.log("clicked");
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <input
        type="number"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        min="0"
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className="px-2 py-1 cursor-pointer border rounded hover:bg-gray-100 min-h-[2rem] flex items-center"
    >
      {value}
    </div>
  );
};

export default EditableCell;