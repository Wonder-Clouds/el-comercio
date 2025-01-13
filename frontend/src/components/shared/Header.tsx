import { Link } from "react-router";

const Header = () => {
  return (
    <header className="bg-[#131010] text-white py-4">
      <nav className="container mx-auto">
        <ul className="flex justify-center items-center space-x-8">
          <li>
            <Link
              to="/"
              className="hover:text-gray-300 transition-colors"
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/entregas"
              className="hover:text-gray-300 transition-colors"
            >
              Entregas
            </Link>
          </li>
          <li>
            <Link
              to="/productos"
              className="hover:text-gray-300 transition-colors"
            >
              Productos
            </Link>
          </li>
          <li>
            <Link
              to="/clientes"
              className="hover:text-gray-300 transition-colors"
            >
              Clientes
            </Link>
          </li>
          <li>
            <Link
              to="/devoluciones"
              className="hover:text-gray-300 transition-colors"
            >
              Devoluciones
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
