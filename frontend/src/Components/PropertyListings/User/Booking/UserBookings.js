import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserBookings = ({ userId }) => {
  const [bookings, setBookings] = useState([]);
  const [editBookingId, setEditBookingId] = useState(null);
  const [newSlot, setNewSlot] = useState({ date: '', startTime: '', endTime: '' });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-indigo-900 tracking-wide">
            My Property Bookings
          </h2>
          <p className="mt-3 text-lg text-purple-700">Manage your scheduled tours</p>
        </div>

        {/* Alert */}
        {alert.show && (
          <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 max-w-sm w-full p-4 rounded-xl shadow-2xl 
            ${alert.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-600 text-white'} 
            transition-all duration-500`}
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold">{alert.message}</p>
              <button onClick={closeAlert} className="text-white hover:text-gray-200 text-xl">
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-purple-600"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md mx-auto">
            <p className="text-xl font-medium text-gray-700">No bookings yet</p>
            <p className="mt-3 text-gray-500">Book a property tour to get started!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {bookings.map(booking => (
              <div
                key={booking._id}
                className="bg-gradient-to-br from-white to-indigo-50 rounded-3xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-indigo-900">{booking.property.title}</h3>
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-600'
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-purple-800">
                    <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="font-medium">{new Date(booking.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}</p>
                  </div>
                  <div className="flex items-center space-x-3 text-purple-800">
                    <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-medium">{booking.startTime} - {booking.endTime}</p>
                  </div>
                </div>

                {booking.status === 'pending' && (
                  <div className="mt-6 flex space-x-4">
                    <button
                      onClick={() => setEditBookingId(booking._id === editBookingId ? null : booking._id)}
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2.5 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 disabled:opacity-60"
                      disabled={actionLoading === booking._id}
                    >
                      {actionLoading === booking._id && editBookingId === booking._id ? (
                        'Updating...'
                      ) : editBookingId === booking._id ? (
                        'Cancel Edit'
                      ) : (
                        'Edit Booking'
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(booking._id)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-2.5 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-60"
                      disabled={actionLoading === booking._id}
                    >
                      {actionLoading === booking._id && editBookingId !== booking._id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  </div>
                )}

                {editBookingId === booking._id && (
                  <div className="mt-6 p-4 bg-indigo-50 rounded-xl shadow-inner transition-all duration-300">
                    <input
                      type="date"
                      value={newSlot.date}
                      onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                      className="w-full p-3 rounded-lg border border-indigo-200 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                    <input
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                      className="w-full p-3 rounded-lg border border-indigo-200 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                    <input
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                      className="w-full p-3 rounded-lg border border-indigo-200 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                    <button
                      onClick={() => handleUpdate(booking._id)}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-60"
                      disabled={actionLoading === booking._id}
                    >
                      {actionLoading === booking._id ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookings;