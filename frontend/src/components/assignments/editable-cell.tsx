import React, { useState, useEffect } from 'react';
import { Assignment } from "@/models/Assignment";

interface EditableCellProps {
  value: number;
  row: { original: Assignment };
  column: { id: string };
  onValueChange: (value: number) => void;
}

const EditableCell = ({
  value: initialValue,
  onValueChange,
}: EditableCellProps) => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  // Sincroniza el estado local cuando el valor inicial cambia
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleOneClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Solo actualiza si el valor ha cambiado
    if (value !== initialValue) {
      onValueChange(value);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    setValue(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
    if (e.key === 'Escape') {
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className="w-full p-1 border rounded"
      />
    );
  }

  return (
    <div 
      onClick={handleOneClick}
      className="p-1 cursor-pointer"
    >
      {value}
    </div>
  );
};

export default EditableCell;