import Home from "../pages/Home";
import { Routes, Route } from "react-router";
import Products from "../pages/Products";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/productos", element: <Products /> }
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