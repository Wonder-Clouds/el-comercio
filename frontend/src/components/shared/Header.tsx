const Header = () => {
  return (
    <header className="bg-[#131010] text-white py-4">
      <nav className="container mx-auto">
        <ul className="flex justify-center items-center space-x-8">
          <li>
            <a href="/" className="hover:text-gray-300 transition-colors">
              Inicio
            </a>
          </li>
          <li>
            <a href="/productos" className="hover:text-gray-300 transition-colors">
              Productos
            </a>
          </li>
          <li>
            <a href="/clientes" className="hover:text-gray-300 transition-colors">
              Clientes
            </a>
          </li>
          <li>
            <a href="/devoluciones" className="hover:text-gray-300 transition-colors">
              Devoluciones
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;