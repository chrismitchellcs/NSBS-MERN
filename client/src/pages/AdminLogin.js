import PasswordForm from "components/AdminLogin/PasswordForm";
import NavBar from "components/General/NavBar";

const AdminLogin = () => {
  return (
    <div>
      <NavBar position="sticky" displayLogo={1} />
      <PasswordForm></PasswordForm>
    </div>
  );
};

export default AdminLogin;
