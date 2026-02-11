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
  LucideIcon,
  PiggyBank,
  HandCoins
} from 'lucide-react';
import { Button } from '../ui/button';
import logo from "@/assets/elcomercio_logo.webp";

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
    {
      text: "Inventario",
      icon: Package,
      children: [
        { to: "/articulos/productos", text: "Productos" },
        { to: "/articulos/periodicos", text: "Periódicos" },
        { to: "/precios", text: "Precios" },
      ]
    },
    { to: "/clientes", text: "Clientes", icon: Users },
    { to: "/finanzas", text: "Finanzas", icon: HandCoins },
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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(null);
      }

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

  // Bloquear scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 text-gray-900 bg-white shadow-md z-50">
      {/* Top Bar - Logo y Logout */}
      <div className="border-b border-gray-200">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between py-3 md:py-4">
            {/* Logo y Título */}
            <div className="flex items-center flex-1 min-w-0 space-x-2 md:space-x-4">
              <img
                src={logo}
                alt="Logo"
                className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16"
              />
              <div className="flex flex-col min-w-0">
                <h1 className="text-sm font-bold truncate md:text-base lg:text-xl xl:text-2xl">
                  Sistema de Gestión de Distribución
                </h1>
                <span className="hidden text-xs text-gray-600 sm:block md:text-sm">
                  Administra productos, asignaciones y reportes
                </span>
              </div>
            </div>

            {/* Botón de Logout - Responsive */}
            <Button
              onClick={handleLogout}
              className="flex items-center flex-shrink-0 px-3 py-2 ml-2 text-xs font-medium text-white transition-colors bg-red-600 rounded-md md:px-4 md:py-2 md:text-sm hover:bg-red-700"
            >
              <LogOut />
              <span>Cerrar sesión</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav>
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between py-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center w-10 h-10 text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg shadow-sm lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile Title */}
            <span className="text-sm font-semibold text-gray-700 lg:hidden">
              Menú Principal
            </span>

            {/* Spacer for mobile */}
            <div className="w-10 lg:hidden"></div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:flex-1">
              <ul className="flex flex-wrap items-center gap-4">
                {menuItems.map((item) => (
                  <li key={item.text} className="relative">
                    {!item.children ? (
                      <Link
                        to={item.to || "#"}
                        className={`group flex items-center space-x-2 px-3 py-2 rounded-md transition-all text-sm xl:text-base ${activeItem === item.text
                          ? 'bg-primary text-white font-medium shadow-md'
                          : 'text-gray-700 hover:bg-primary hover:text-white'
                          }`}
                        onClick={() => setActiveItem(item.text)}
                      >
                        <item.icon
                          size={18}
                          className={`flex-shrink-0 ${activeItem === item.text
                            ? 'text-white'
                            : 'text-gray-700 group-hover:text-white'
                            }`}
                        />
                        <span className="whitespace-nowrap">{item.text}</span>
                      </Link>
                    ) : (
                      <div className="relative">
                        <button
                          onClick={() => setDropdownOpen(dropdownOpen === item.text ? null : item.text)}
                          className={`group flex items-center space-x-2 px-3 py-2 rounded-md transition-all text-sm xl:text-base ${activeItem === item.text
                            ? 'bg-primary text-white font-medium shadow-md'
                            : 'text-gray-700 hover:bg-primary hover:text-white'
                            }`}
                        >
                          <item.icon
                            size={18}
                            className={`flex-shrink-0 transition-colors ${activeItem === item.text
                              ? 'text-white'
                              : 'text-gray-700 group-hover:text-white'
                              }`}
                          />
                          <span className="whitespace-nowrap">{item.text}</span>
                          <ChevronDown
                            size={16}
                            className={`flex-shrink-0 transition-transform ${dropdownOpen === item.text ? 'rotate-180' : ''
                              }`}
                          />
                        </button>
                        {dropdownOpen === item.text && (
                          <ul
                            ref={dropdownRef}
                            className="absolute left-0 z-20 py-2 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl w-52 animate-fadeIn"
                          >
                            {item.children.map((child) => (
                              <li key={child.to}>
                                <Link
                                  to={child.to}
                                  className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-primary hover:text-white"
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
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Full Screen Overlay */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu */}
            <div
              ref={mobileMenuRef}
              className="fixed inset-x-0 top-0 z-50 h-screen overflow-y-auto bg-white lg:hidden animate-slideInRight"
            >
              {/* Mobile Menu Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-4 bg-gradient-to-r from-primary to-primary/90">
                <div className="flex items-center space-x-3">
                  <img src={logo} alt="Logo" className="w-10 h-10" />
                  <span className="text-lg font-bold text-white">Menú</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-10 h-10 text-white transition-colors bg-white/20 rounded-lg hover:bg-white/30"
                  aria-label="Cerrar menú"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Mobile Menu Items */}
              <ul className="px-4 py-4 space-y-2">
                {menuItems.map((item) => (
                  <li key={item.text}>
                    {!item.children ? (
                      <Link
                        to={item.to || "#"}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${activeItem === item.text
                          ? 'bg-primary text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        onClick={() => {
                          setActiveItem(item.text);
                          setIsOpen(false);
                        }}
                      >
                        <item.icon
                          size={20}
                          className={`flex-shrink-0 ${activeItem === item.text ? 'text-white' : 'text-gray-700'
                            }`}
                        />
                        <span className="font-medium">{item.text}</span>
                      </Link>
                    ) : (
                      <div>
                        <button
                          onClick={() => setDropdownOpen(dropdownOpen === item.text ? null : item.text)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${activeItem === item.text
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                          <div className="flex items-center space-x-3">
                            <item.icon
                              size={20}
                              className={`flex-shrink-0 ${activeItem === item.text ? 'text-white' : 'text-gray-700'
                                }`}
                            />
                            <span className="font-medium">{item.text}</span>
                          </div>
                          <ChevronDown
                            size={20}
                            className={`flex-shrink-0 transition-transform duration-200 ${dropdownOpen === item.text ? 'rotate-180' : ''
                              }`}
                          />
                        </button>

                        {dropdownOpen === item.text && (
                          <ul className="pl-4 mt-2 space-y-1 border-l-2 border-primary/30">
                            {item.children.map((child) => (
                              <li key={child.to}>
                                <Link
                                  to={child.to}
                                  className="block px-4 py-2 text-sm text-gray-700 transition-colors rounded-lg hover:bg-primary/10 hover:text-primary"
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
              </ul>

              {/* Mobile Menu Footer */}
              <div className="px-4 py-4 mt-auto border-t border-gray-200">
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center w-full py-3 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                >
                  <LogOut />
                  <span className="font-medium">Cerrar Sesión</span>
                </Button>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;