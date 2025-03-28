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
          {/*User*/}
          <Route path="/propertyPage" element={<PropertyPage />} />
          <Route path="/my-bookings" element={<UserBookings userId={userId} />} />
          <Route path="/properties/:propertyId/slots" element={<PropertySlots />} />

        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
