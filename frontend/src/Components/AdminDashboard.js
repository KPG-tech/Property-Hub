import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaHome, FaCalendarAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-indigo-700">
          Seller Dashboard
        </div>
        <nav className="flex-1 p-4">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Property Management</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/seller/add-property"
                  className="flex items-center p-2 hover:bg-indigo-700 rounded"
                >
                  <FaHome className="mr-2" />
                  Add Property
                </Link>
              </li>
              <li>
                <Link
                  to="/seller/property-details"
                  className="flex items-center p-2 hover:bg-indigo-700 rounded"
                >
                  <FaHome className="mr-2" />
                  Property Details
                </Link>
              </li>
              <li>
                <Link
                  to="/seller/payment"
                  className="flex items-center p-2 hover:bg-indigo-700 rounded"
                >
                  <FaHome className="mr-2" />
                  Payment
                </Link>
              </li>
              <li>
                <Link
                  to="/seller/bank-slip-upload"
                  className="flex items-center p-2 hover:bg-indigo-700 rounded"
                >
                  <FaHome className="mr-2" />
                  Bank Slip Upload
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Booking Management</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/seller/bookings" // Placeholder for future booking management route
                  className="flex items-center p-2 hover:bg-indigo-700 rounded"
                >
                  <FaCalendarAlt className="mr-2" />
                  View Bookings
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <div className="p-4 border-t border-indigo-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 bg-red-600 hover:bg-red-700 rounded"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <Outlet /> {/* Renders nested routes (seller routes) */}
      </div>
    </div>
  );
};

export default AdminDashboard;