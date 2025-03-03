import { useState } from 'react';
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
  OctagonAlert
} from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { to: "/", text: "Inicio", icon: Home },
    { to: "/entregas", text: "Entregas", icon: Truck },
    { to: "/devoluciones", text: "Devoluciones", icon: RotateCcw },
    { to: "/productos", text: "Productos", icon: Package },
    { to: "/clientes", text: "Clientes", icon: Users },
    { to: "/deudores", text: "Deudores", icon: OctagonAlert },
    { to: "/reportes", text: "Reportes", icon: TrendingUp }
  ];

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/';
  };

  return (
    <header className="py-4 text-white bg-gray-950">
      <nav className="container px-4 mx-auto">
        {/* Mobile menu button */}
        <div className="flex justify-end lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className={`
          flex flex-col lg:flex-row items-center justify-between
          ${isOpen ? 'block' : 'hidden'} lg:flex
          mt-4 md:mt-0
        `}>
          {/* Centered menu items */}
          <div className="flex-1" /> {/* Spacer */}
          <ul className="flex flex-col items-center space-y-4 lg:flex-row lg:space-y-0 lg:space-x-8">
            {menuItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="flex items-center space-x-2 transition-colors hover:text-gray-300"
                >
                  <item.icon size={20} />
                  <span>{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex justify-end flex-1"> {/* Spacer with logout */}
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center mt-4 space-x-2 transition-colors hover:text-gray-300 lg:mt-0"
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