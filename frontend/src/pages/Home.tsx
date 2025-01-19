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
        <CardContent className="grid gap-4 p-5 md:grid-cols-4">
          <Link to="/productos" className="flex items-center p-4 rounded-lg bg-muted hover:bg-muted/80">
            <Box className="w-6 h-6 mr-2" />
            <span>Gestionar Productos</span>
          </Link>
          <Link to="/clientes" className="flex items-center p-4 rounded-lg bg-muted hover:bg-muted/80">
            <Users className="w-6 h-6 mr-2" />
            <span>Gestionar Clientes</span>
          </Link>
          <Link to="/entregas" className="flex items-center p-4 rounded-lg bg-muted hover:bg-muted/80">
            <DollarSign className="w-6 h-6 mr-2" />
            <span>Ver entregas</span>
          </Link>
          <Link to="/devoluciones" className="flex items-center p-4 rounded-lg bg-muted hover:bg-muted/80">
            <Activity className="w-6 h-6 mr-2" />
            <span>Ver devoluciones</span>
          </Link>
        </CardContent>
      </Card>
    </>
  );
}

export default Home;