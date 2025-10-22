import { ROUTES } from "@/constants/routes";
import Login from "@/features/common/Login";
import Register from "../common/Register";


export const ROUTE_CONFIG = [
  {
    path: ROUTES.ROOT,
    component: <Home />,
    name: "Root",
  },
 
  {
    path: ROUTES.LOGIN,
    component: <Login />,
    name: "Login ",
  },
  {
    path: ROUTES.REGISTER,
    component: <Register />,
    name: "Register",
  },
  {
    path: ROUTES.RESET_PASSWORD,
    component: <ResetPassword />,
    name: "Reset Password",
  },
 
];

const useRouterManager = () => {
  return {
    ROUTE_CONFIG,
  };
};

export default useRouterManager;
