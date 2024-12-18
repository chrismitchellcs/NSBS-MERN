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
import ScrollToTop from "components/General/ScrollToTop";
import ReturnPolicy from "pages/ReturnPolicy";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <div className="pages">
          <ProvideAuth>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/service" element={<Service />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/shop" element={<Shop />}>
                <Route path="/shop/:brand" element={<Shop />} />
              </Route>
              <Route path="/shop/:brand/:bikeid" element={<BikeDetails />} />
              <Route path="/bike" element={<Shop />} />
              {/* <Route path="/bikedetails" element={<BikeDetails />} /> */}
              <Route path="/return-policy" element={<ReturnPolicy />} />
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
