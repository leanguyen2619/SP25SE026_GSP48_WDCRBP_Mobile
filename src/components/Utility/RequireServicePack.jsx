import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";

const RequireServicePack = ({ children }) => {
  const { auth } = useAuth();

  const hasActivePack =
    auth?.woodworker?.servicePackEndDate &&
    Date.now() <= new Date(auth?.woodworker?.servicePackEndDate).getTime();

  if (hasActivePack) {
    return children;
  }

  return <Navigate to="/ww/profile" />;
};

export default RequireServicePack;
