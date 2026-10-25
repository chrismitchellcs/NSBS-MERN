import Home from "pages/Home";
import ScrollToTop from "components/General/ScrollToTop";
import { AuthProvider } from "components/AuthProvider";
import { HelmetProvider } from "react-helmet-async";
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NORCO_CATALOG_ENABLED } from "config/features";

const Service = lazy(() => import("pages/Service"));
const Contact = lazy(() => import("pages/Contact"));
const Shop = lazy(() => import("pages/Shop"));
const BikeDetails = lazy(() => import("pages/BikeDetails"));
const ReturnPolicy = lazy(() => import("pages/ReturnPolicy"));
const AdminDashboard = lazy(() => import("pages/AdminDashboard"));
const AdminLogin = lazy(() => import("pages/AdminLogin"));
const AdminBikes = lazy(() => import("components/AdminActions/AdminBikes"));
const AdminAddBikesTransition = lazy(
  () => import("pages/AdminAddBikesTransition"),
);
const AdminAddBikesNorco = lazy(() => import("pages/AdminAddBikesNorco"));
const AdminAddBikesNew = lazy(() => import("pages/AdminAddBikesNew"));
const AdminHeaderHeroPage = lazy(() => import("pages/AdminHeaderHero"));
const AdminServiceListingsPage = lazy(
  () => import("pages/AdminServiceListings"),
);
const Checkout = lazy(() => import("pages/Checkout"));
const NotFound = lazy(() => import("pages/NotFound"));

const routeFallback = (
  <div
    style={{
      minHeight: "50vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#666",
      fontSize: "0.95rem",
    }}
    role="status"
    aria-live="polite"
  >
    Loading…
  </div>
);

const App = () => {
  return (
    <HelmetProvider>
      <div className="App">
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="pages">
              <Suspense fallback={routeFallback}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/service" element={<Service />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/shop" element={<Shop />}>
                    <Route path="/shop/:brand" element={<Shop />} />
                  </Route>
                  <Route
                    path="/shop/:brand/:bikeid"
                    element={<BikeDetails />}
                  />
                  <Route path="/bike" element={<Shop />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/return-policy" element={<ReturnPolicy />} />
                  <Route path="/admin-oldadd" element={<AdminBikes />} />
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route
                    path="/admin-addbikes-transition"
                    element={<AdminAddBikesTransition />}
                  />
                  {NORCO_CATALOG_ENABLED ? (
                    <Route
                      path="/admin-addbikes-norco"
                      element={<AdminAddBikesNorco />}
                    />
                  ) : null}
                  <Route
                    path="/admin-addbikes-new"
                    element={<AdminAddBikesNew />}
                  />
                  <Route
                    path="/admin-header-hero"
                    element={<AdminHeaderHeroPage />}
                  />
                  <Route
                    path="/admin-service-listings"
                    element={<AdminServiceListingsPage />}
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
          </BrowserRouter>
        </AuthProvider>
      </div>
    </HelmetProvider>
  );
};

export default App;
