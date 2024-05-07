import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const ProvideAuth = ({ children }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

const useProvideAuth = () => {
  const navigate = useNavigate();

  const [isAuth, setIsAuth] = useState(false);
  const login = async ({ password }) => {
    console.log(password);
    await axios
      .post("http://localhost:5050/api/auth", {
        password,
      })
      .then((res) => {
        setIsAuth(true);
        navigate("/adminpage");
      })
      .catch((error) => {
        alert("incorrect password");
      });
  };
  const logout = () => {
    setIsAuth(false);
  };

  return { isAuth, login };
};
