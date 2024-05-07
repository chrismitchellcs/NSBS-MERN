import Closer from "components/General/Closer";
import NavBar from "components/General/NavBar";
import ContactPage from "components/ContactPage/ContactPage";

const Contact = () => {
  return (
    <div>
      <NavBar background="white" position={"sticky"} displayLogo={1}></NavBar>
      <ContactPage></ContactPage>
      <Closer></Closer>
    </div>
  );
};

export default Contact;
