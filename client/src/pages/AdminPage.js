import axios from "axios";
import AddBike from "components/AdminActions/AddBike";
import AdminBikes from "components/AdminActions/AdminBikes";
import NavBar from "components/General/NavBar";
import { useEffect, useState } from "react";

const AdminPage = () => {
  const [bikes, setBikes] = useState([]);
  useEffect(() => {
    const fetchBikes = async () => {
      await axios
        .get("http://localhost:5050/api/bikes/", {})
        .then((res) => {
          setBikes(res.data);
        })
        .catch((error) => {});
    };
    fetchBikes();
  }, []);

  return (
    <div>
      <NavBar background="white" position={"sticky"} displayLogo={1}></NavBar>

      <AddBike setBikes={setBikes}></AddBike>
      <AdminBikes bikes={bikes} setBikes={setBikes}></AdminBikes>
    </div>
  );
};

export default AdminPage;
