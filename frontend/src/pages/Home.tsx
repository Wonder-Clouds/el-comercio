import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";
import { Activity, Box, DollarSign, Users } from 'lucide-react'
import elcomercio from "@/assets/elcomercio_logo.webp";

const Home = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <img src={elcomercio} alt="Logo" className="w-32 h-32 mb-6" />
        <h1 className="text-3xl text-center">Distribuciones El Comercio</h1>
      </div>
      <Card className="col-span-4 mt-12">
        <CardContent className="grid gap-4 md:grid-cols-4 p-5">
          <Link to="/productos" className="flex items-center p-4 bg-muted rounded-lg hover:bg-muted/80">
            <Box className="h-6 w-6 mr-2" />
            <span>Gestionar Productos</span>
          </Link>
          <Link to="/clientes" className="flex items-center p-4 bg-muted rounded-lg hover:bg-muted/80">
            <Users className="h-6 w-6 mr-2" />
            <span>Gestionar Clientes</span>
          </Link>
          <Link to="/ventas" className="flex items-center p-4 bg-muted rounded-lg hover:bg-muted/80">
            <DollarSign className="h-6 w-6 mr-2" />
            <span>Ver Ventas</span>
          </Link>
          <Link to="/reportes" className="flex items-center p-4 bg-muted rounded-lg hover:bg-muted/80">
            <Activity className="h-6 w-6 mr-2" />
            <span>Generar Reportes</span>
          </Link>
        </CardContent>
      </Card>
    </>
  );
}

export default Home;