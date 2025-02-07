import { formatDateToSpanishSafe, formatDateToYYYYMMDD } from '@/utils/formatDate';
import { ArrowLeftCircle, ArrowRightCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface CalendarProps {
  onDateSelect: (date: string | null) => void;
  changeStatusCalendar: (status: boolean) => void;
}

const CalendarPicker: React.FC<CalendarProps> = ({ onDateSelect, changeStatusCalendar }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showYearSelector, setShowYearSelector] = useState(false);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Generar array de años (10 años antes y después del año actual)
  const currentYear = currentDate.getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleYearClick = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setShowYearSelector(false);
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    onDateSelect(formatDateToYYYYMMDD(newDate));
    changeStatusCalendar(false);
  };
  
  const getDayClass = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const isSelected = selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();

    let classes = "h-24 w-full flex flex-col p-2 cursor-pointer ";

    if (isToday) {
      classes += "bg-gray-100 ";
    } else if (isSelected) {
      classes += "bg-gray-700 text-white ";
    } else {
      classes += "hover:bg-gray-50 ";
    }

    return classes;
  };

  return (
    <div className="bg-white p-8">
      <div className="mx-auto border border-gray-300 shadow-sm">
        <div className="flex justify-between items-center p-6 bg-gray-50 border-b border-gray-300">
          <button
            onClick={handlePrevMonth}
            className="p-2 border rounded-full border-gray-300 bg-white hover:bg-gray-50"
          >
            <ArrowLeftCircle />
          </button>
          <div className="flex flex-col items-center relative">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              {months[currentDate.getMonth()]}
              <button 
                onClick={() => setShowYearSelector(!showYearSelector)}
                className="inline-flex items-center hover:bg-gray-100 rounded px-2 py-1"
              >
                {currentDate.getFullYear()}
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </h2>
            
            {showYearSelector && (
              <div className="absolute top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                <div className="grid grid-cols-3 gap-1 p-2">
                  {years.map(year => (
                    <button
                      key={year}
                      onClick={() => handleYearClick(year)}
                      className={`px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                        year === currentDate.getFullYear() ? 'bg-gray-200' : ''
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleNextMonth}
            className="p-2 border border-gray-300 rounded-full bg-white hover:bg-gray-50"
          >
            <ArrowRightCircle />
          </button>
        </div>

        <div className="grid grid-cols-7 border-b border-gray-300">
          {weekDays.map(day => (
            <div key={day} className="text-center py-4 border-r border-gray-300 last:border-r-0 font-semibold text-gray-600">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="h-24 border-r border-b border-gray-300 last:border-r-0" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => (
            <div
              key={index + 1}
              className="border-r border-b border-gray-300 last:border-r-0"
              onClick={() => handleDateClick(index + 1)}
            >
              <div className={getDayClass(index + 1)}>
                <span className="text-lg">{index + 1}</span>
                <div className="mt-2 text-xs">
                </div>
              </div>
            </div>
          ))}
        </div>
        {selectedDate && (
          <div className="p-4 text-center border-t border-gray-300 bg-gray-50 text-gray-700">
            Fecha seleccionada: {formatDateToSpanishSafe(
              `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPicker;