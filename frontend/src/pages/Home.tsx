import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";
import { Box, Users, TrendingUp, RotateCcw, Truck, Clock, Calendar } from 'lucide-react';
import useSellersCount from "@/hooks/useSellersCount";
import useProductsCount from "@/hooks/useProductsCount";
import useAssignmentsCount from "@/hooks/useAssignment";
import { useEffect, useState } from "react";

const Home = () => {
  const { totalSellers, loading, error } = useSellersCount();
  const { totalProducts, loading: loadingProducts, error: errorProducts } = useProductsCount();
  const { totalAssignments, loading: assignmentsLoading, error: assignmentsError } = useAssignmentsCount();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      setGreeting("Buenos días");
    } else if (hour < 19) {
      setGreeting("Buenas tardes");
    } else {
      setGreeting("Buenas noches");
    }
  }, [currentTime]);

  const menuItems = [
    {
      title: "Gestionar Productos",
      description: "Administra tu inventario y asignales su precio",
      icon: Box,
      path: "/articulos/productos",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Gestionar Vendedores",
      description: "Maneja a tus vendedores y asignales sus productos",
      icon: Users,
      path: "/clientes",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Ver Entregas",
      description: "Controla tus entregas y asignaciones",
      icon: Truck,
      path: "/entregas/productos",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Ver Devoluciones",
      description: "Control de devoluciones de productos",
      icon: RotateCcw,
      path: "/devoluciones/productos",
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Reportes",
      description: "Ver gráficos y reportes",
      icon: TrendingUp,
      path: "/reportes",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    }
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="p-4">
      <div className="container mx-auto">
        {/* Welcome Header */}
        <div className="flex flex-col gap-6 p-4 md:flex-row md:justify-between md:items-center md:p-6">
          <div className="flex flex-col text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-2 space-x-3">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-5xl">
                {greeting}!
              </h1>
            </div>

            <p className="text-base text-gray-800 sm:text-lg md:text-xl">
              Bienvenido al Sistema de Distribución de El Comercio
            </p>
          </div>

          <div className="flex flex-row justify-center gap-6 md:flex-col md:items-end md:space-y-4 md:gap-0">
            <div className="flex items-center space-x-2 text-gray-800">
              <Calendar className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs sm:text-sm md:text-base capitalize">
                {formatDate(currentTime)}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-gray-800">
              <Clock className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs sm:text-sm md:text-base font-mono">
                {formatTime(currentTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats with Enhanced Design */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <Card className="transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm font-medium text-blue-600">Entregas Totales</p>
                  {assignmentsLoading ? (
                    <h3 className="text-3xl font-bold text-gray-800">...</h3>
                  ) : assignmentsError ? (
                    <h3 className="text-2xl font-bold text-red-600">Error</h3>
                  ) : (
                    <h3 className="text-4xl font-bold text-gray-800">{totalAssignments}</h3>
                  )}
                  <p className="mt-1 text-xs text-blue-600">↑ Actualizadas hoy</p>
                </div>
                <div className="p-4 rounded-full bg-blue-200/50">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm font-medium text-green-600">Productos Activos</p>
                  {loadingProducts ? (
                    <h3 className="text-3xl font-bold text-gray-800">...</h3>
                  ) : errorProducts ? (
                    <h3 className="text-2xl font-bold text-red-600">Error</h3>
                  ) : (
                    <h3 className="text-4xl font-bold text-gray-800">{totalProducts}</h3>
                  )}
                  <p className="mt-1 text-xs text-green-600">En inventario</p>
                </div>
                <div className="p-4 rounded-full bg-green-200/50">
                  <Box className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm font-medium text-purple-600">Vendedores Activos</p>
                  {loading ? (
                    <h3 className="text-3xl font-bold text-gray-800">...</h3>
                  ) : error ? (
                    <h3 className="text-2xl font-bold text-red-600">Error</h3>
                  ) : (
                    <h3 className="text-4xl font-bold text-gray-800">{totalSellers}</h3>
                  )}
                  <p className="mt-1 text-xs text-purple-600">En tu equipo</p>
                </div>
                <div className="p-4 rounded-full bg-purple-200/50">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Menu with Better Design */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-800">Acceso Rápido</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="block group"
              >
                <Card className="h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                  <CardContent className={`p-6 h-full ${item.bgColor}`}>
                    <div className="flex flex-col h-full">
                      <div className={`w-12 h-12 ${item.color} bg-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-gray-800 group-hover:text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 group-hover:text-gray-700">
                        {item.description}
                      </p>
                      <div className="flex items-center mt-auto text-sm font-semibold text-gray-500 group-hover:text-gray-700">
                        <span>Ir ahora</span>
                        <span className="ml-2 transition-transform duration-300 group-hover:translate-x-2">→</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Sistema de Gestión Empresarial · Distribuciones El Comercio
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;