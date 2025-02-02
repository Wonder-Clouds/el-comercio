import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";
import { Box, Users, TrendingUp, RotateCcw, Truck } from 'lucide-react';
import elcomercio from "@/assets/elcomercio_logo.webp";

const Home = () => {
  const menuItems = [
    {
      title: "Gestionar Productos",
      description: "Administra tu inventario y asignales su precio",
      icon: Box,
      path: "/productos",
      color: "text-blue-600"
    },
    {
      title: "Gestionar Vendedores",
      description: "Maneja a tus distribuidores",
      icon: Users,
      path: "/clientes",
      color: "text-green-600"
    },
    {
      title: "Ver Entregas",
      description: "Controla tus entregas",
      icon: Truck,
      path: "/entregas",
      color: "text-purple-600"
    },
    {
      title: "Ver Devoluciones",
      description: "Control de devoluciones",
      icon:   RotateCcw,
      path: "/devoluciones",
      color: "text-red-600"
    }
  ];

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center mb-12">
        <div className="relative">
          <img
            src={elcomercio}
            alt="Logo"
            className="w-32 h-32 mb-6 transition-shadow duration-300 rounded-lg shadow-lg hover:shadow-xl"
          />
        </div>
        <h1 className="mb-2 text-4xl font-bold text-gray-800">Distribuciones El Comercio</h1>
        <p className="text-lg text-gray-600">Sistema Administrativo para la Distribución de Periodicos y Productos</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Entregas totales</p>
                <h3 className="text-2xl font-bold text-gray-800">$24,500</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Box className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Productos Activos</p>
                <h3 className="text-2xl font-bold text-gray-800">1,234</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Vendedores activos</p>
                <h3 className="text-2xl font-bold text-gray-800">856</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Menu */}
      <Card className="bg-white">
        <CardContent className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex flex-col p-6 transition-colors duration-300 border border-gray-100 rounded-xl bg-gray-50 hover:bg-gray-100 hover:border-gray-200"
            >
              <div className="flex items-center mb-4">
                <item.icon className={`w-6 h-6 mr-3 ${item.color}`} />
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{item.description}</p>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default Home;