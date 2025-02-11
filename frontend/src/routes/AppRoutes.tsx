import MainLayout from "@/components/shared/MainLayout";
import { ProtectedRoutes, PublicRoute } from "@/routes/ProtectedRoutes";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import AddProduct from "@/pages/AddProduct";
import Sellers from "@/pages/Sellers";
import Assignments from "@/pages/Assignments";
import Login from "@/pages/Login";
import Devolutions from "@/pages/Devolutions";
import Reports from "@/pages/Reports";
import { Outlet, Route, Routes } from "react-router";


const protectedRoutes = [
  { path: "/", element: <Home /> },
  { path: "/entregas", element: <Assignments /> },
  { path: "/productos", element: <Products /> },
  { path: "/devoluciones", element: <Devolutions /> },
  { path: "/clientes", element: <Sellers /> },
  { path: "/nuevo-producto", element: <AddProduct /> },
  { path: "/reportes", element: <Reports /> },
];

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoutes />}>
        <Route
          element={
            <MainLayout>
              <Outlet />
            </MainLayout>
          }
        >
          {protectedRoutes.map((route) => (
            <Route key={route.path} {...route} />
          ))}
        </Route>
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;