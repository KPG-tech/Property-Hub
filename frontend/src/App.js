import React from "react";
import { Route, Routes } from "react-router-dom";
import SellerLogin from './Components/PropertyListings/Seller/Login/Login'
import SellerRegister from './Components/PropertyListings/Seller/Register/Register'
import SellerAddProperty from "./Components/PropertyListings/Seller/PropertyAdd/AddProperty";
import SellerUpdateProperty from "./Components/PropertyListings/Seller/PropertyUpdate/PropertyUpdate";
import SellerPropertyDetails from "./Components/PropertyListings/Seller/PropertyDetails/PropertyDetails";
import PropertyPage from "./Components/PropertyListings/User/PropertyPage/PropertyPage";
function App() {
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
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
