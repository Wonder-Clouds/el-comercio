import { Link } from "react-router";

const Header = () => {
  return (
    <header className="py-4 text-white bg-gray-950">
      <nav className="container mx-auto">
        <ul className="flex items-center justify-center space-x-8">
          <li>
            <Link
              to="/inicio"
              className="transition-colors hover:text-gray-300"
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/entregas"
              className="transition-colors hover:text-gray-300"
            >
              Entregas
            </Link>
          </li>
          <li>
            <Link
              to="/productos"
              className="transition-colors hover:text-gray-300"
            >
              Productos
            </Link>
          </li>
          <li>
            <Link
              to="/clientes"
              className="transition-colors hover:text-gray-300"
            >
              Clientes
            </Link>
          </li>
          <li>
            <Link
              to="/devoluciones"
              className="transition-colors hover:text-gray-300"
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
