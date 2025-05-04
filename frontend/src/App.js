import React from "react";
import { Route, Routes } from "react-router-dom";
import SellerLogin from './Components/PropertyListings/Seller/Login/Login'
import SellerRegister from './Components/PropertyListings/Seller/Register/Register'
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


function App() {
  const userId = '67e69eada0d1f11b129d382e'; 
  return (
    <div >
      <React.Fragment>
        <Routes>
          {/*Seller*/}
          <Route path="/sellerLogin" element={<SellerLogin />} />
          <Route path="/sellerRegister" element={<SellerRegister />} />
          <Route path="/sellerAddProperty" element={<SellerAddProperty />} />
          <Route path="/updateproperty/:id" element={<SellerUpdateProperty />} />
          <Route path="/sellerPropertyDetails" element={<SellerPropertyDetails />} />
          <Route path="/prediction-results" element={<PricePredictionPage />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/" element={<Payment />} />
        <Route path="/bank-slip-upload" element={<BankSlipUploadPage />} />
          {/*User*/}
          <Route path="/propertyPage" element={<PropertyPage />} />
          <Route path="/my-bookings" element={<UserBookings userId={userId} />} />
          <Route path="/properties/:propertyId/slots" element={<PropertySlots />} />


          <Route path="/admin/payments" element={<AdminPayments />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
