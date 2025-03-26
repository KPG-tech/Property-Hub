// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const UserBookings = ({ userId }) => {
//   const [bookings, setBookings] = useState([]);

//   useEffect(() => {
//     axios.get(`http://localhost:8070/propertyBooking/users/${userId}/bookings`)
//       .then(response => setBookings(response.data))
//       .catch(error => console.error(error));
//   }, [userId]);

//   const handleUpdate = async (bookingId, newSlot) => {
//     try {
//       const response = await axios.put(`http://localhost:8070/propertyBooking/bookings/${bookingId}/update`, newSlot);
//       setBookings(bookings.map(b => b._id === bookingId ? response.data : b));
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleDelete = async (bookingId) => {
//     try {
//       await axios.delete(`http://localhost:8070/propertyBooking/bookings/${bookingId}`);
//       setBookings(bookings.filter(b => b._id !== bookingId));
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <h2>My Bookings</h2>
//       {bookings.map(booking => (
//         <div key={booking._id}>
//           <h3>{booking.property.title}</h3>
//           <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
//           <p>Time: {booking.startTime} - {booking.endTime}</p>
//           <p>Status: {booking.status}</p>
          
//           {booking.status === 'pending' && (
//             <>
//               <button onClick={() => handleUpdate(booking._id, {
//                 // Add form to select new slot
//                 date: 'new-date',
//                 startTime: 'new-start',
//                 endTime: 'new-end'
//               })}>
//                 Update Booking
//               </button>
//               <button onClick={() => handleDelete(booking._id)}>
//                 Cancel Booking
//               </button>
//             </>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default UserBookings;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserBookings = ({ userId }) => {
  const [bookings, setBookings] = useState([]);
  const [editBookingId, setEditBookingId] = useState(null);
  const [newSlot, setNewSlot] = useState({ date: '', startTime: '', endTime: '' });

  useEffect(() => {
    axios.get(`http://localhost:8070/propertyBooking/users/${userId}/bookings`)
      .then(response => setBookings(response.data))
      .catch(error => console.error(error));
  }, [userId]);

  const handleUpdate = async (bookingId) => {
    try {
      const response = await axios.put(`http://localhost:8070/propertyBooking/bookings/${bookingId}/update`, newSlot);
      setBookings(bookings.map(b => b._id === bookingId ? response.data : b));
      setEditBookingId(null);
      setNewSlot({ date: '', startTime: '', endTime: '' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:8070/propertyBooking/bookings/${bookingId}`);
      setBookings(bookings.filter(b => b._id !== bookingId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h2>
      <div className="space-y-6">
        {bookings.map(booking => (
          <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800">{booking.property.title}</h3>
            <p className="text-gray-600">Date: {new Date(booking.date).toLocaleDateString()}</p>
            <p className="text-gray-600">Time: {booking.startTime} - {booking.endTime}</p>
            <p className="text-gray-600">Status: <span className={`font-medium ${booking.status === 'confirmed' ? 'text-green-600' : booking.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>{booking.status}</span></p>
            
            {booking.status === 'pending' && (
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => setEditBookingId(booking._id === editBookingId ? null : booking._id)}
                  className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition"
                >
                  {editBookingId === booking._id ? 'Cancel Edit' : 'Update Booking'}
                </button>
                <button
                  onClick={() => handleDelete(booking._id)}
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                >
                  Cancel Booking
                </button>
              </div>
            )}

            {editBookingId === booking._id && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <input
                  type="date"
                  value={newSlot.date}
                  onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                  className="w-full p-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="time"
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                  className="w-full p-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="time"
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                  className="w-full p-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleUpdate(booking._id)}
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserBookings;