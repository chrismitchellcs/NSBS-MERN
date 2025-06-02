import { Stack } from "@mui/material";
import PasswordForm from "components/AdminLogin/PasswordForm";
import NavBar from "components/General/NavBar";

const AdminLogin = () => {
  return (
    <div>
      <NavBar background="white" position={"sticky"} displayLogo={1}></NavBar>
      <PasswordForm></PasswordForm>
    </div>
  );
};

export default AdminLogin;
