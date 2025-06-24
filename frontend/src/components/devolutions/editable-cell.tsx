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

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== initialValue) {
      onValueChange(value);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    setValue(newValue);
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        autoFocus
        className="w-full p-1 border rounded"
      />
    );
  }

  return (
    <div onClick={() => setIsEditing(true)} className="px-2 py-1 cursor-pointer border rounded hover:bg-gray-100">
      {value}
    </div>
  );
};

export default EditableCell;
