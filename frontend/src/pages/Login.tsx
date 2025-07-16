import { useState } from "react";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import logo from "@/assets/elcomercio_logo.webp";
import { useNavigate } from "react-router";
import { Token } from "@/api/Token.api";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {

    setIsLoading(true);
    setError("");

    try {
      const response = await Token(username, password);

      if (response.status === 401) {
        throw new Error("Credenciales inválidas");
      }

      const { access, refresh } = response.data;

      if (access) {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);

        const tokenPayload = JSON.parse(window.atob(access.split(".")[1]));
        localStorage.setItem("userId", tokenPayload.user_id);

        navigate("/");
      } else {
        throw new Error("Token inválido");
      }
    } catch {
      setError("Inicio de sesión fallido. Por favor, verifica tus credenciales.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900  to-slate-800 p-4">

      {/* Contenedor principal */}
      <div className="relative z-10 w-full max-w-md">
        <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-2xl">
          <CardHeader className="text-center">
            {/* Logo/Icono de la empresa */}
            <div className="mx-auto mb-4 overflow-hidden rounded-full">
              <img src={logo} alt="Logo" className="w-24 h-24 p-2 mx-auto" />
            </div>

            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Distribuciones El Comercio
            </CardTitle>
            <CardDescription className="text-gray-600">
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              {/* Campo Usuario */}
              <div className="space-y-2">
                <Label htmlFor="user" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Usuario
                </Label>
                <Input
                  id="user"
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              {/* Campo Contraseña */}
              <div className="space-y-2 relative">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className=" h-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Botón de inicio de sesión */}
              <Button
                type="submit"
                disabled={isLoading}
                onClick={handleSubmit}
                className="h-12 bg-gradient-to-r flex justify-center bg-slate-600 hover:bg-blue-800 text-white font-semibold shadow-lg hover:shadow-xl duration-200 mx-auto"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>

              {/* Mensaje de error */}
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>

          <CardFooter className="text-center">
            <p className="text-sm text-gray-500">
              ¿Olvidaste tu contraseña?{" "}
              <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Contacta al administrador
              </button>
            </p>
          </CardFooter>
        </Card>

        {/* Información adicional */}
        <div className="mt-6 text-center">
          <p className="text-blue-100 text-sm">
            Sistema de gestión empresarial v2.0
          </p>
        </div>
      </div>
    </div>
  )
}

