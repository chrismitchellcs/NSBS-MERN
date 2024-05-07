import Home from "pages/Home";
import Service from "pages/Service";
import Contact from "pages/Contact";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Shop from "pages/Shop";
import Login from "pages/LogIn";
import { ProtectedRoute } from "components/AdminLogin/ProtectedRoute";
import AdminPage from "pages/AdminPage";
import { ProvideAuth } from "components/AdminLogin/auth";
import BikeDetails from "pages/BikeDetails";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <ProvideAuth>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/service" element={<Service />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/bikedetails" element={<BikeDetails />} />
              <Route path="/adminlogin" element={<Login />} />
              <Route
                path="/adminpage"
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                }
              ></Route>
            </Routes>
          </ProvideAuth>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
