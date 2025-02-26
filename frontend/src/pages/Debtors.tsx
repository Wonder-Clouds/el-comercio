import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useState } from "react";

function Debtors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div>
      <div className="relative">
        <div className="relative">
          <Search className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 left-3 top-1/2" />
          <Input
            type="text"
            placeholder="Buscar producto por nombre"
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <button onClick={clearSearch} className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {isSearching && (
          <div className="absolute -translate-y-1/2 right-14 top-1/2">
            <div className="w-4 h-4 border-2 border-gray-300 rounded-full animate-spin border-t-gray-600" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Debtors;