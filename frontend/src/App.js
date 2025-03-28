import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './component/Home';
import UserBookings from './component/UserBookings';
import PropertySlots from './component/PropertySlots';

function App() {
  const userId = '67e4161d34de40d36aeeea4b'; // Replace with actual user ID from auth

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold">Property Booker</h1>
            <div className="space-x-4">
              <a href="/" className="text-white hover:text-blue-200 transition">Home</a>
              <a href="/my-bookings" className="text-white hover:text-blue-200 transition">My Bookings</a>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-bookings" element={<UserBookings userId={userId} />} />
          <Route path="/properties/:propertyId/slots" element={<PropertySlots />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;