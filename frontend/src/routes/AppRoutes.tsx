import { Routes, Route, useLocation } from "react-router";
import Home from "../pages/Home";
import Products from "../pages/Products";
import AddProduct from "@/pages/AddProduct";
import Sellers from "@/pages/Sellers";
import Assignments from "@/pages/Assignments";
import Login from "@/pages/Login";
import MainLayout from "@/components/shared/MainLayout";
import Devolutions from "@/pages/Devolutions";
import Reports from "@/pages/Reports";

const routes = [
  { path: "/", element: <Login /> },
  { path: "/inicio", element: <Home /> },
  { path: "/entregas", element: <Assignments /> },
  { path: "/productos", element: <Products /> },
  { path: "/devoluciones", element: <Devolutions /> },
  { path: "/clientes", element: <Sellers /> },
  { path: "/nuevo-producto", element: <AddProduct /> },
  { path: "/reportes", element:  <Reports /> },
];

const AppRoutes = () => {
  const location = useLocation();

  const isLoginRoute = location.pathname === "/";

  return (
    <div>
      {isLoginRoute ? (
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      ) : (
        <MainLayout>
          <Routes>
            {routes
              .filter((route) => route.path !== "/")
              .map((route, index) => (
                <Route key={index} {...route} />
              ))}
          </Routes>
        </MainLayout>
      )}
    </div>
  );
};

export default AppRoutes;