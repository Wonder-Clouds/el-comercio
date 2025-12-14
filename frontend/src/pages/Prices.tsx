import { useState, useEffect } from 'react';
import { editTypeProduct, getTypeProducts } from '@/api/TypeProduct.api';
import { TypeProduct, Types } from '@/models/TypeProduct';

const Prices = () => {
  const [newspapers, setNewspapers] = useState<TypeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<TypeProduct | null>(null);
  const [saving, setSaving] = useState(false);

  const daysOfWeek = [
    { key: 'monday_price', label: 'Lunes' },
    { key: 'tuesday_price', label: 'Martes' },
    { key: 'wednesday_price', label: 'Miércoles' },
    { key: 'thursday_price', label: 'Jueves' },
    { key: 'friday_price', label: 'Viernes' },
    { key: 'saturday_price', label: 'Sábado' },
    { key: 'sunday_price', label: 'Domingo' },
  ];

  useEffect(() => {
    fetchNewspapers();
  }, []);

  const fetchNewspapers = async () => {
    try {
      setLoading(true);
      const response = await getTypeProducts();
      // Filtrar solo periódicos
      const newspaperData = response.filter(item => item.type === Types.NEWSPAPER);
      setNewspapers(newspaperData);
    } catch (error) {
      console.error('Error fetching newspapers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (newspaper: TypeProduct) => {
    setEditingId(newspaper.id);
    setEditingData({ ...newspaper });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingData(null);
  };

  const handleSave = async () => {
    if (!editingData) return;

    try {
      setSaving(true);
      await editTypeProduct(editingData.id, editingData);

      // Actualizar el estado local
      setNewspapers(prev =>
        prev.map(newspaper =>
          newspaper.id === editingData.id ? { ...newspaper, ...editingData } : newspaper
        )
      );

      setEditingId(null);
      setEditingData(null);
    } catch (error) {
      console.error('Error updating newspaper:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof TypeProduct, value: string | number) => {
    if (!editingData) return;

    setEditingData(prev => ({
      ...prev!,
      [field]: field.includes('price') ? (value === '' ? undefined : Number(value)) : value
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto py-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Cargando precios de periódicos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container space-y-5 mx-auto py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-4xl font-bold">Precios de periódicos</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Periódico
                </th>
                {daysOfWeek.map(day => (
                  <th key={day.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {day.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {newspapers.map((newspaper) => (
                <tr key={newspaper.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {newspaper.name}
                    </div>
                  </td>
                  {daysOfWeek.map(day => (
                    <td key={day.key} className="px-6 py-4 whitespace-nowrap">
                      {editingId === newspaper.id ? (
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editingData?.[day.key as keyof TypeProduct] || ''}
                          onChange={(e) => handleInputChange(day.key as keyof TypeProduct, e.target.value)}
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">
                          {newspaper[day.key as keyof TypeProduct]
                            ? `S/ ${Number(newspaper[day.key as keyof TypeProduct]).toFixed(2)}`
                            : '-'
                          }
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingId === newspaper.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          {saving ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={saving}
                          className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(newspaper)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Editar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {newspapers.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">No se encontraron periódicos</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prices;