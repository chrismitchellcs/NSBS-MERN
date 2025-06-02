import axios from "axios";
import AddBike from "components/AdminActions/AddBike";
import AdminBikes from "components/AdminActions/AdminBikes";
import NavBar from "components/General/NavBar";
import { useEffect, useState } from "react";

const AdminPage = () => {
  const [bikes, setBikes] = useState([]);
  useEffect(() => {
    const fetchBikes = async () => {
      console.log(process.env.REACT_APP_VERCEL_DOMAIN);
      await axios
        .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/`, {})
        .then((res) => {
          setBikes(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchBikes();
  }, []);

  return (
    <div>
      <NavBar background="white" position={"sticky"} displayLogo={1}></NavBar>

      <AddBike setBikes={setBikes}></AddBike>
      {/* <AdminBikes bikes={bikes} setBikes={setBikes}></AdminBikes> */}
    </div>
  );
};

export default AdminPage;
