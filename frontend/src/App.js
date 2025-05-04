import React from "react";
import { Route, Routes, Navigate, Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import SellerLogin from './Components/PropertyListings/Seller/Login/Login';
import SellerRegister from './Components/PropertyListings/Seller/Register/Register';
import SellerAddProperty from "./Components/PropertyListings/Seller/PropertyAdd/AddProperty";
import SellerUpdateProperty from "./Components/PropertyListings/Seller/PropertyUpdate/PropertyUpdate";
import SellerPropertyDetails from "./Components/PropertyListings/Seller/PropertyDetails/PropertyDetails";
import PropertyPage from "./Components/PropertyListings/User/PropertyPage/PropertyPage";
import UserBookings from "./Components/PropertyListings/User/Booking/UserBookings";
import PropertySlots from "./Components/PropertyListings/User/Booking/PropertySlots";
import PricePredictionPage from "./Components/PropertyListings/User/PricePredictionPage/PricePredictionPage";
import Payment from "./Components/PropertyListings/Payment/payment";
import BankSlipUploadPage from "./Components/PropertyListings/Payment/BankSlipUpload";
import AdminPayments from "./Components/admin/PaymentAdmin";
import Header from "./Components/Header";
import AdminDashboard from "./Components/AdminDashboard";
import BookingManagement from "./Components/PropertyListings/Booking/BookingManagement";

// Header component

// Layout component to include header
function LayoutWithHeader({ children }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
}

// ProtectedRoute component to handle role-based access
function ProtectedRoute({ element, allowedRole }) {
  const userRole = localStorage.getItem('role');

  // Check if the user's role matches the allowed role
  if (userRole === allowedRole) {
    return element;
  } else {
    // Redirect to home if the role doesn't match
    return <Navigate to="/" replace />;
  }
}

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          {/* Public Routes with Header */}
          <Route
            path="/"
            element={<LayoutWithHeader><PropertyPage /></LayoutWithHeader>}
          />
          <Route
            path="/prediction-results"
            element={<LayoutWithHeader><PricePredictionPage /></LayoutWithHeader>}
          />
          <Route
            path="/login"
            element={<LayoutWithHeader><SellerLogin /></LayoutWithHeader>}
          />
          <Route
            path="/register"
            element={<LayoutWithHeader><SellerRegister /></LayoutWithHeader>}
          />

          {/* User Routes with Header */}
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute
                element={<LayoutWithHeader><UserBookings /></LayoutWithHeader>}
                allowedRole="user"
              />
            }
          />
          <Route
            path="/properties/:propertyId/slots"
            element={
              <ProtectedRoute
                element={<LayoutWithHeader><PropertySlots /></LayoutWithHeader>}
                allowedRole="user"
              />
            }
          />

          {/* Seller Routes (Nested under AdminDashboard) */}
          <Route
            path="/seller"
            element={
              <ProtectedRoute
                element={<AdminDashboard />}
                allowedRole="seller"
              />
            }
          >
            <Route path="add-property" element={<SellerAddProperty />} />
            <Route path="update-property/:id" element={<SellerUpdateProperty />} />
            <Route path="property-details" element={<SellerPropertyDetails />} />
            <Route path="payment" element={<Payment />} />
            <Route path="bank-slip-upload" element={<BankSlipUploadPage />} />
            <Route path="bookings" element={<BookingManagement />} />
          </Route>

          {/* Admin Routes (No Header) */}
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute
                element={<AdminPayments />}
                allowedRole="admin"
              />
            }
          />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;