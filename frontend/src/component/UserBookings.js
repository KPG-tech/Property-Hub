import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserBookings = ({ userId }) => {
  const [bookings, setBookings] = useState([]);
  const [editBookingId, setEditBookingId] = useState(null);
  const [newSlot, setNewSlot] = useState({ date: '', startTime: '', endTime: '' });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // For update/delete actions
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8070/propertyBooking/users/${userId}/bookings`);
        setBookings(response.data);
      } catch (error) {
        console.error(error);
        setAlert({ show: true, message: 'Failed to load bookings', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [userId]);

  const handleUpdate = async (bookingId) => {
    try {
      setActionLoading(bookingId);
      const response = await axios.put(`http://localhost:8070/propertyBooking/bookings/${bookingId}/update`, newSlot);
      setBookings(bookings.map(b => b._id === bookingId ? response.data : b));
      setEditBookingId(null);
      setNewSlot({ date: '', startTime: '', endTime: '' });
      setAlert({ show: true, message: 'Booking updated successfully!', type: 'success' });
    } catch (error) {
      const message = error.response?.data?.message || 'Error updating booking';
      setAlert({ show: true, message, type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (bookingId) => {
    try {
      setActionLoading(bookingId);
      await axios.delete(`http://localhost:8070/propertyBooking/bookings/${bookingId}`);
      setBookings(bookings.filter(b => b._id !== bookingId));
      setAlert({ show: true, message: 'Booking cancelled successfully!', type: 'success' });
    } catch (error) {
      const message = error.response?.data?.message || 'Error cancelling booking';
      setAlert({ show: true, message, type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const closeAlert = () => setAlert({ show: false, message: '', type: '' });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center animate-fade-in">My Bookings</h2>

      {/* Alert */}
      {alert.show && (
        <div className={`mb-6 p-4 rounded-lg shadow-md animate-slide-in ${alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <div className="flex justify-between items-center">
            <p>{alert.message}</p>
            <button onClick={closeAlert} className="text-xl font-bold">&times;</button>
          </div>
        </div>
      )}

      {/* Loader for initial fetch */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No bookings found.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => (
            <div
              key={booking._id}
              className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">{booking.property.title}</h3>
              <p className="text-gray-600 text-lg">Date: {new Date(booking.date).toLocaleDateString()}</p>
              <p className="text-gray-600 text-lg">Time: {booking.startTime} - {booking.endTime}</p>
              <p className="text-gray-600 text-lg">
                Status:{' '}
                <span
                  className={`font-medium px-2 py-1 rounded-full ${
                    booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-600'
                      : booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {booking.status}
                </span>
              </p>

              {booking.status === 'pending' && (
                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={() => setEditBookingId(booking._id === editBookingId ? null : booking._id)}
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-2 px-4 rounded-md hover:from-yellow-500 hover:to-yellow-600 transition duration-300"
                    disabled={actionLoading === booking._id}
                  >
                    {actionLoading === booking._id && editBookingId === booking._id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mx-auto"></div>
                    ) : editBookingId === booking._id ? (
                      'Cancel Edit'
                    ) : (
                      'Update Booking'
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(booking._id)}
                    className="flex-1 bg-gradient-to-r from-red-400 to-red-500 text-white py-2 px-4 rounded-md hover:from-red-500 hover:to-red-600 transition duration-300"
                    disabled={actionLoading === booking._id}
                  >
                    {actionLoading === booking._id && editBookingId !== booking._id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mx-auto"></div>
                    ) : (
                      'Cancel Booking'
                    )}
                  </button>
                </div>
              )}

              {editBookingId === booking._id && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-inner animate-fade-in">
                  <input
                    type="date"
                    value={newSlot.date}
                    onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                    className="w-full p-3 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <input
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                    className="w-full p-3 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <input
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                    className="w-full p-3 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <button
                    onClick={() => handleUpdate(booking._id)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-md hover:from-blue-600 hover:to-blue-700 transition duration-300"
                    disabled={actionLoading === booking._id}
                  >
                    {actionLoading === booking._id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mx-auto"></div>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookings;

// Custom Tailwind animations
const customStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideIn {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }
  .animate-slide-in {
    animation: slideIn 0.5s ease-in-out;
  }
`;

// Add this to your CSS file (e.g., src/index.css)
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = customStyles;
document.head.appendChild(styleSheet);