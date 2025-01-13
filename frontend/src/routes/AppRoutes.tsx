import Home from "../pages/Home";
import { Routes, Route } from "react-router";
import Products from "../pages/Products";
import AddProduct from "@/pages/AddProduct";
import Sellers from "@/pages/Sellers";
import Assignments from "@/pages/Assignments";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/entregas", element: <Assignments /> },
  { path: "/productos", element: <Products /> },
  { path: "/nuevo-producto", element: <AddProduct /> },
  { path: "/clientes", element: <Sellers /> }
]

const AppRoutes = () => {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} {...route} />
      ))}
    </Routes>
  );
}

export default AppRoutes;