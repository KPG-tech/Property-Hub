import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Seller Components
import SellerLogin from './Components/PropertyListings/Seller/Login/Login';
import SellerRegister from './Components/PropertyListings/Seller/Register/Register';
import SellerAddProperty from "./Components/PropertyListings/Seller/PropertyAdd/AddProperty";
import SellerUpdateProperty from "./Components/PropertyListings/Seller/PropertyUpdate/PropertyUpdate";
import SellerPropertyDetails from "./Components/PropertyListings/Seller/PropertyDetails/PropertyDetails";

// User & Payment Components
import PropertyPage from "./Components/PropertyListings/User/PropertyPage/PropertyPage";
// Update these lines in App.js:
import Payment from './Components/PropertyListings/Payment/payment';
import BankSlipUploadPage from './Components/PropertyListings/BankSlipUpload/BankSlipUpload';


// Admin Component
import AdminPayments from "./Components/admin/PaymentAdmin";

function App() {
  return (
    <Router>
      <Routes>
        {/* Seller Routes */}
        <Route path="/sellerLogin" element={<SellerLogin />} />
        <Route path="/sellerRegister" element={<SellerRegister />} />
        <Route path="/sellerAddProperty" element={<SellerAddProperty />} />
        <Route path="/updateproperty/:id" element={<SellerUpdateProperty />} />
        <Route path="/sellerPropertyDetails" element={<SellerPropertyDetails />} />

        {/* User Routes */}
        <Route path="/propertyPage" element={<PropertyPage />} />

        {/* Payment Routes */}
        <Route path="/payment" element={<Payment />} />
        <Route path="/upload-slip" element={<BankSlipUploadPage />} />

        {/* Admin Route */}
        <Route path="/admin/payments" element={<AdminPayments />} />

        {/* Default Route */}
        <Route path="/" element={<Payment />} />
      </Routes>
    </Router>
  );
}

export default App;
