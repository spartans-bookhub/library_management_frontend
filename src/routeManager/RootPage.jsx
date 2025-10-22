import { useNavigate } from "react-router-dom";
import { ROUTE_CONFIG } from "./useRouterManager";

const RootPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center flex-col gap-2 p-4">
      {ROUTE_CONFIG.map((route, index) => {
        if (index === 0) {
          return <></>;
        }
        return (
          <div
            key={index}
            onClick={() => navigate(route.path)}
            className="text-sm underline text-teal-400 cursor-pointer "
          >
            Go to {route.name} Page
          </div>
        );
      })}
    </div>
  );
};

export default RootPage;
