import NavBar from "components/General/NavBar";
import PasswordForm from "components/AdminLogin/PasswordForm";

const LogIn = () => {
  return (
    <div>
      <NavBar background="white" position={"sticky"} displayLogo={1}></NavBar>
      <PasswordForm></PasswordForm>
    </div>
  );
};

export default LogIn;
