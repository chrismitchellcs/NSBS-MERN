import Closer from "components/General/Closer";
import NavBar from "components/General/NavBar";
import ContactPage from "components/ContactPage/ContactPage";
import SEO from "components/General/SEO";

const Contact = () => {
  return (
    <div>
      <SEO
        title="Contact Us | North Shore Bike Shop | North Vancouver"
        description="Get in touch with North Shore Bike Shop. Visit us in North Vancouver or contact us for bike sales, service inquiries, or general questions."
        keywords="bike shop contact, North Vancouver bike shop, bike shop hours, bike shop location, contact bike shop"
        url="https://www.northshorebikeshop.net/contact"
      />
      <NavBar background="white" position={"sticky"} displayLogo={1}></NavBar>
      <ContactPage></ContactPage>
      <Closer></Closer>
    </div>
  );
};

export default Contact;
