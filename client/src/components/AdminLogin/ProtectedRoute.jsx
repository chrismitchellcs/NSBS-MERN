import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";

export const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  console.log(isAuth);
  if (!isAuth) {
    console.log("navigating");
    navigate("/adminlogin");
  } else {
    return children;
  }
};
