import { BrowserRouter, Routes, Route } from "react-router-dom";
import useRouter from "./useRouterManager";

const RouterManager = () => {
  const { ROUTE_CONFIG } = useRouter();

  
  return (
    <BrowserRouter>
      <Routes>
        {ROUTE_CONFIG.map((item) => {
          return (
            <Route path={item.path} key={item.path} element={item.component} />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
};

export default RouterManager;
