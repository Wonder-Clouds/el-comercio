import React, { useState, useEffect } from 'react';
import { Assignment } from "@/models/Assignment";

interface EditableCellProps {
  value: number | string;
  row?: { original: Assignment };
  column?: { id: string };
  onValueChange: (value: number | string) => void;
  maxQuantity?: number;
  productName?: string;
}

const EditableCell = ({
  value: initialValue,
  onValueChange,
  maxQuantity,
  productName
}: EditableCellProps) => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string>('');

  // Sincroniza el estado local cuando el valor inicial cambia
  useEffect(() => {
    setValue(initialValue);
    setError('');
  }, [initialValue]);

  const handleOneClick = () => {
    setIsEditing(true);
    setError('');

    if (value === 0 || value === "0") {
      setValue('');
    }
  };

  const validateValue = (newValue: number): boolean => {
    if (maxQuantity !== undefined && newValue > maxQuantity) {
      setError(`No puede exceder ${maxQuantity} unidades${productName ? ` para ${productName}` : ''}`);
      return false;
    }
    if (newValue < 0) {
      setError('La cantidad no puede ser negativa');
      return false;
    }
    setError('');
    return true;
  };

  const handleBlur = () => {
    setIsEditing(false);

    const numericValue = value === '' ? 0 : parseInt(value as string) || 0;

    if (validateValue(numericValue)) {
      if (numericValue !== initialValue) {
        onValueChange(numericValue);
      }
      setValue(numericValue);
    } else {
      setValue(initialValue);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    setValue(newValue);

    validateValue(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
    if (e.key === 'Escape') {
      setValue(initialValue);
      setIsEditing(false);
      setError('');
    }
  };

  if (isEditing) {
    return (
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          min="0"
          max={maxQuantity}
          className={`w-full p-1 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
        {error && (
          <div className="absolute z-10 p-2 mt-1 text-xs text-white bg-red-500 rounded shadow-lg whitespace-nowrap">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        onClick={handleOneClick}
        className={`p-1 cursor-pointer ${error ? 'bg-red-100' : ''}`}
        title={maxQuantity ? `Máximo: ${maxQuantity}` : ''}
      >
        {value}
      </div>
      {error && (
        <div className="absolute z-10 p-2 mt-1 text-xs text-white bg-red-500 rounded shadow-lg whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
};

export default EditableCell;