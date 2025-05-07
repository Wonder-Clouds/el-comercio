import { useState, useEffect, useRef } from 'react'; // 👈 Agrega useEffect y useRef
import { Link } from "react-router";
import {
  Home,
  Truck,
  Package,
  Users,
  RotateCcw,
  LogOut,
  Menu,
  X,
  TrendingUp,
  OctagonAlert,
  ChevronDown,
  HandCoins
} from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLUListElement | null>(null);

  const menuItems = [
    { to: "/", text: "Inicio", icon: Home },
    {
      text: "Entregas",
      icon: Truck,
      children: [
        { to: "/entregas/productos", text: "Productos" },
        { to: "/entregas/periodicos", text: "Periódicos" },
      ]
    },
    { 
      text: "Devoluciones",
      icon: RotateCcw,
      children: [
        { to: "/devoluciones", text: "Productos" },
        { to: "/devoluciones", text: "Periódicos" },
      ]
    },
    { to: "/cobranzas", text: "Cobranzas", icon: HandCoins },
    { 
      text: "Artículos",
      icon: Package ,
      children: [
        { to: "/productos", text: "Productos" },
        { to: "/periodicos", text: "Periódicos" },
      ]
    },
    { to: "/clientes", text: "Clientes", icon: Users },
    { to: "/deudores", text: "Deudores", icon: OctagonAlert },
    { to: "/reportes", text: "Reportes", icon: TrendingUp }
  ];

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(null);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="text-white bg-gray-950">
      <nav className="container px-4 mx-auto">
        <div className="flex justify-end lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className={`
          flex flex-col lg:flex-row items-center justify-between
          ${isOpen ? 'block' : 'hidden'} lg:flex
          mt-4 md:mt-0
        `}>
          <ul className="flex flex-col items-center space-y-4 lg:flex-row lg:space-y-0 lg:space-x-8">
            {menuItems.map((item) => (
              <li key={item.text} className="relative">
                {!item.children ? (
                  <Link
                    to={item.to}
                    className="flex items-center space-x-2 transition-colors hover:text-gray-300"
                  >
                    <item.icon size={20} />
                    <span>{item.text}</span>
                  </Link>
                ) : (
                  <div>
                    <button
                      onClick={() => setDropdownOpen(dropdownOpen === item.text ? null : item.text)}
                      className="flex items-center space-x-2 transition-colors hover:text-gray-300 focus:outline-none"
                    >
                      <item.icon size={20} />
                      <span>{item.text}</span>
                      <ChevronDown size={16} />
                    </button>
                    {dropdownOpen === item.text && (
                      <ul ref={dropdownRef} className="absolute left-0 z-10 mt-2 space-y-2 bg-gray-800 rounded-lg shadow-lg w-48 p-2">
                        {item.children.map((child) => (
                          <li key={child.to}>
                            <Link
                              to={child.to}
                              className="block px-4 py-2 text-sm transition-colors rounded hover:bg-gray-700"
                            >
                              {child.text}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="flex justify-end flex-1">
            <button
              onClick={handleLogout}
              className="flex items-center mt-4 space-x-2 bg-gray-800 p-4 transition-colors hover:text-gray-300 hover:bg-slate-500 lg:mt-0"
            >
              <LogOut size={20} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;