import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { useNavigate } from "react-router";
import { Token } from "@/api/Token.api";

export default function LoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

        navigate("/inicio");
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
    <Card className="w-[350px] shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 overflow-hidden rounded-full">
          <img src="/api/placeholder/64/64" alt="Logo" className="w-16 h-16 mx-auto" />
        </div>
        <CardTitle className="text-2xl font-bold">Bienvenido</CardTitle>
        <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid items-center w-full gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="user">Correo electrónico</Label>
              <Input
                id="user"
                type="text"
                placeholder="User"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <CardFooter className="flex flex-col mt-4">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
