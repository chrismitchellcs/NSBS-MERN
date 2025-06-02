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
import AdminDashboard from "pages/AdminDashboard";
import { AuthProvider } from "components/AuthProvider";
import AdminLogin from "pages/AdminLogin";
import AdminAddBikes from "pages/AdminAddBikesTransition";
import AdminViewBikes from "pages/AdminViewBikes";
import AdminBikes from "components/AdminActions/AdminBikes";
import AdminAddBikesTransition from "pages/AdminAddBikesTransition";
import AdminAddBikesNorco from "pages/AdminAddBikesNorco";
import AdminAddBikesNew from "pages/AdminAddBikesNew";

const App = () => {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="pages">
            {/* <ProvideAuth> */}
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
              <Route path="/admin-oldadd" element={<AdminBikes />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              {/* <Route path="/admin-addbikes" element={<AdminAddBikes />} /> */}
              <Route
                path="/admin-addbikes-transition"
                element={<AdminAddBikesTransition />}
              />
              <Route
                path="/admin-addbikes-norco"
                element={<AdminAddBikesNorco />}
              />
              <Route path="/admin-viewbikes" element={<AdminViewBikes />} />
              <Route
                path="/admin-addbikes-new"
                element={<AdminAddBikesNew />}
              />
              {/* <Route
                path="/adminpage"
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                }
              ></Route> */}
            </Routes>
            {/* </ProvideAuth> */}
          </div>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
};

export default App;
