import MainLayout from "@/components/shared/MainLayout";
import { ProtectedRoutes, PublicRoute } from "@/routes/ProtectedRoutes";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import Sellers from "@/pages/Sellers";
import Login from "@/pages/Login";
import Reports from "@/pages/Reports";
import { Outlet, Route, Routes } from "react-router";
import Debtors from "@/pages/Debtors";
import Collections from "@/pages/Collections";
import Newspapers from "@/pages/Newspapers";
import Returns from "@/pages/Returns";
import Finances from "@/pages/Finances";
import Cash from "@/pages/Cash";
import Assignments from "@/pages/Assignments";

const protectedRoutes = [
  { path: "/", element: <Home /> },
  { path: "/entregas/:type", element: <Assignments /> },
  { path: "/devoluciones/:type", element: <Returns /> },
  { path: "/finanzas", element: <Finances /> },
  { path: "/productos", element: <Products /> },
  { path: "/periodicos", element: <Newspapers /> },
  { path: "/cobranzas", element: <Collections /> },
  { path: "/clientes", element: <Sellers /> },
  { path: "/deudores", element: <Debtors /> },
  { path: "/reportes", element: <Reports /> },
  { path: "/caja", element: <Cash /> },
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