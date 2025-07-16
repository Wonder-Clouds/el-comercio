import { useState, useEffect, useRef } from 'react';
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
  // HandCoins,
  LucideIcon,
  PiggyBank,
  HandCoins
} from 'lucide-react';

// Definimos interfaces para mejorar el tipado
interface ChildMenuItem {
  to: string;
  text: string;
}

interface MenuItem {
  to?: string;
  text: string;
  icon: LucideIcon;
  children?: ChildMenuItem[];
}

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<string>('');

  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  // Detectar ruta actual para marcado activo
  useEffect(() => {
    const path = window.location.pathname;
    const active = menuItems.find(item =>
      item.to === path ||
      (item.children?.some(child => child.to === path))
    );
    if (active) {
      setActiveItem(active.text);
    }
  }, []);

  const menuItems: MenuItem[] = [
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
        { to: "/devoluciones/productos", text: "Productos" },
        { to: "/devoluciones/periodicos", text: "Periódicos" },
      ]
    },
    { to: "/finanzas", text: "Finanzas", icon: HandCoins },
    // { to: "/cobranzas", text: "Cobranzas", icon: HandCoins },
    {
      text: "Inventario",
      icon: Package,
      children: [
        { to: "/articulos/productos", text: "Productos" },
        { to: "/articulos/periodicos", text: "Periódicos" },
      ]
    },
    { to: "/clientes", text: "Clientes", icon: Users },
    { to: "/deudores", text: "Deudores", icon: OctagonAlert },
    { to: "/reportes", text: "Reportes", icon: TrendingUp },
    { to: "/caja", text: "Caja", icon: PiggyBank },
  ];

  const handleLogout = (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/';
  };

  // Manejar clics fuera del dropdown y menú móvil
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      // Cerrar dropdown si se hace clic fuera
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(null);
      }

      // Cerrar menú móvil si se hace clic fuera
      if (
        isOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        (event.target as Element).closest('button')?.getAttribute('aria-label') !== 'Toggle menu'
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header className="text-white bg-gradient-to-r from-slate-900 to-gray-950 shadow-lg">
      <nav className="container lg:mx-auto p-4">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white rounded-md p-2 hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-between lg:items-center">
            <ul className="flex items-center space-x-1">
              {menuItems.map((item) => (
                <li key={item.text} className="relative">
                  {!item.children ? (
                    <Link
                      to={item.to || "#"}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all ${activeItem === item.text
                        ? 'bg-blue-600 text-white font-medium'
                        : 'hover:bg-gray-800'
                        }`}
                      onClick={() => setActiveItem(item.text)}
                    >
                      <item.icon size={18} className={activeItem === item.text ? 'text-white' : 'text-blue-400'} />
                      <span>{item.text}</span>
                    </Link>
                  ) : (
                    <div className="relative">
                      <button
                        onClick={() => setDropdownOpen(dropdownOpen === item.text ? null : item.text)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all ${activeItem === item.text
                          ? 'bg-blue-600 text-white font-medium'
                          : 'hover:bg-gray-800'
                          }`}
                        aria-expanded={dropdownOpen === item.text}
                      >
                        <item.icon size={18} className={activeItem === item.text ? 'text-white' : 'text-blue-400'} />
                        <span>{item.text}</span>
                        <ChevronDown
                          size={16}
                          className={`ml-1 transition-transform duration-200 ${dropdownOpen === item.text ? 'rotate-180' : ''
                            }`}
                        />
                      </button>
                      {dropdownOpen === item.text && (
                        <ul
                          ref={dropdownRef}
                          className="absolute left-0 z-20 mt-1 bg-gray-800 rounded-md shadow-lg w-48 py-1 animate-fadeIn"
                        >
                          {item.children.map((child) => (
                            <li key={child.to}>
                              <Link
                                to={child.to}
                                className="block px-4 py-2 text-sm transition-colors hover:bg-gray-700 hover:text-blue-400"
                                onClick={() => {
                                  setDropdownOpen(null);
                                  setActiveItem(item.text);
                                }}
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

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors ml-4"
            >
              <LogOut size={18} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            ref={mobileMenuRef}
            className="lg:hidden mt-4 bg-gray-900 rounded-lg shadow-xl border border-gray-800 animate-slideDown"
          >
            <ul className="py-2">
              {menuItems.map((item) => (
                <li key={item.text} className="px-3 py-1">
                  {!item.children ? (
                    <Link
                      to={item.to || "#"}
                      className={`flex items-center space-x-3 p-2 rounded-md ${activeItem === item.text
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-800'
                        }`}
                      onClick={() => {
                        setActiveItem(item.text);
                        setIsOpen(false);
                      }}
                    >
                      <item.icon size={18} className={activeItem === item.text ? 'text-white' : 'text-blue-400'} />
                      <span>{item.text}</span>
                    </Link>
                  ) : (
                    <div>
                      <button
                        onClick={() => setDropdownOpen(dropdownOpen === item.text ? null : item.text)}
                        className={`w-full flex items-center justify-between p-2 rounded-md ${activeItem === item.text
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-800'
                          }`}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon size={18} className={activeItem === item.text ? 'text-white' : 'text-blue-400'} />
                          <span>{item.text}</span>
                        </div>
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${dropdownOpen === item.text ? 'rotate-180' : ''
                            }`}
                        />
                      </button>

                      {dropdownOpen === item.text && (
                        <ul className="ml-6 mt-1 space-y-1 border-l-2 border-gray-700 pl-3">
                          {item.children.map((child) => (
                            <li key={child.to}>
                              <Link
                                to={child.to}
                                className="block p-2 text-sm transition-colors rounded-md hover:bg-gray-800 hover:text-blue-400"
                                onClick={() => {
                                  setActiveItem(item.text);
                                  setIsOpen(false);
                                  setDropdownOpen(null);
                                }}
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

              <li className="px-3 py-2 mt-3 border-t border-gray-700">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-800 p-2 rounded-md hover:bg-red-600 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Cerrar sesión</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;