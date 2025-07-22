import { Login, NotFound } from "../page/Auth";
import { Category, Home, Order, Website } from "../page/Home";
export const paths = {
  home: "/",
  order: "/order",
  category: "/category",
  website: "/website",
  login: "/",
  createAdmin: "create-admin",
  notFound: "*",
};

export const AuthRouteList = [
  {
    id: 1,
    path: paths.login,
    element: <Login />,
  },
  {
    id: 2,
    path: paths.notFound,
    element: <NotFound />,
  },
];

export const HomeRouteList = [
  {
    id: 1,
    path: paths.home,
    element: <Home />,
  },
  {
    id: 2,
    path: paths.order,
    element: <Order />,
  },
  {
    id: 3,
    path: paths.category,
    element: <Category />,
  },
  {
    id: 4,
    path: paths.website,
    element: <Website />,
  },
  {
    id: 5,
    path: paths.notFound,
    element: <NotFound />,
  },
];
