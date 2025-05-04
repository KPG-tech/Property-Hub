import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaCheck, FaTimes, FaTrash, FaPlus, FaEdit } from 'react-icons/fa';

const BookingManagement = () => {
  const sellerId = localStorage.getItem('SelleruserId')  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSlot, setNewSlot] = useState({ propertyId: '', date: '', startTime: '', endTime: '' });
  const [editSlot, setEditSlot] = useState(null);

  // Fetch seller's properties with slots
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`http://localhost:8070/propertyBooking/sellers/${sellerId}/properties-slots`);
        setProperties(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProperties();
  }, [sellerId]);

  // Handle booking status update (accept/reject)
  const handleBookingStatus = async (bookingId, status) => {
    try {
      await axios.put(`http://localhost:8070/propertyBooking/bookings/${bookingId}`, { status });
      setProperties(properties.map(property => ({
        ...property,
        availableSlots: property.availableSlots.map(slot =>
          slot.bookingId === bookingId ? { ...slot, bookingStatus: status } : slot
        )
      })));
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle cancel confirmed booking
  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.delete(`http://localhost:8070/propertyBooking/bookings/${bookingId}/cancel`);
        setProperties(properties.map(property => ({
          ...property,
          availableSlots: property.availableSlots.map(slot =>
            slot.bookingId === bookingId
              ? { ...slot, isBooked: false, bookingStatus: null, bookedBy: null, bookingId: null }
              : slot
          )
        })));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Handle add new slot
  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8070/propertyBooking/properties/${newSlot.propertyId}/slots`, {
        date: newSlot.date,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime
      });
      setProperties(properties.map(property =>
        property._id === newSlot.propertyId
          ? {
              ...property,
              availableSlots: [
                ...property.availableSlots,
                { ...response.data.slot, _id: response.data.slot._id, isBooked: false }
              ]
            }
          : property
      ));
      setNewSlot({ propertyId: '', date: '', startTime: '', endTime: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle update slot
  const handleUpdateSlot = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8070/propertyBooking/properties/${editSlot.propertyId}/slots/${editSlot._id}`, {
        date: editSlot.date,
        startTime: editSlot.startTime,
        endTime: editSlot.endTime
      });
      setProperties(properties.map(property =>
        property._id === editSlot.propertyId
          ? {
              ...property,
              availableSlots: property.availableSlots.map(slot =>
                slot._id === editSlot._id ? response.data.slot : slot
              )
            }
          : property
      ));
      setEditSlot(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle remove slot
  const handleRemoveSlot = async (propertyId, slotId) => {
    if (window.confirm('Are you sure you want to remove this slot?')) {
      try {
        await axios.delete(`http://localhost:8070/propertyBooking/properties/${propertyId}/slots/${slotId}`);
        setProperties(properties.map(property =>
          property._id === propertyId
            ? {
                ...property,
                availableSlots: property.availableSlots.filter(slot => slot._id !== slotId)
              }
            : property
        ));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Booking Management</h2>

      {/* Add New Slot Form */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Add New Slot</h3>
        <form onSubmit={handleAddSlot} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={newSlot.propertyId}
            onChange={(e) => setNewSlot({ ...newSlot, propertyId: e.target.value })}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Property</option>
            {properties.map(property => (
              <option key={property._id} value={property._id}>{property.title}</option>
            ))}
          </select>
          <input
            type="date"
            value={newSlot.date}
            onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="time"
            value={newSlot.startTime}
            onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="time"
            value={newSlot.endTime}
            onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="col-span-1 md:col-span-2 bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 flex items-center justify-center"
          >
            <FaPlus className="mr-2" /> Add Slot
          </button>
        </form>
      </div>

      {/* Edit Slot Form (shown when editing) */}
      {editSlot && (
        <div className="mb-8 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Edit Slot</h3>
          <form onSubmit={handleUpdateSlot} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              value={editSlot.date}
              onChange={(e) => setEditSlot({ ...editSlot, date: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input
              type="time"
              value={editSlot.startTime}
              onChange={(e) => setEditSlot({ ...editSlot, startTime: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input
              type="time"
              value={editSlot.endTime}
              onChange={(e) => setEditSlot({ ...editSlot, endTime: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <div className="col-span-1 md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo+flex items-center justify-center"
              >
                <FaCheck className="mr-2" /> Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditSlot(null)}
                className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Properties and Slots */}
      {properties.map(property => (
        <div key={property._id} className="mb-8 p-4 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">{property.title}</h3>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Booked By</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {property.availableSlots.map(slot => (
                <tr key={slot._id} className="border-b">
                  <td className="p-2">{new Date(slot.date).toLocaleDateString()}</td>
                  <td className="p-2">{`${slot.startTime} - ${slot.endTime}`}</td>
                  <td className="p-2">
                    {slot.bookingStatus ? (
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          slot.bookingStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          slot.bookingStatus === 'confirmed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {slot.bookingStatus}
                      </span>
                    ) : 'Available'}
                  </td>
                  <td className="p-2">
                    {slot.bookedBy ? `${slot.bookedBy.name} (${slot.bookedBy.email})` : '-'}
                  </td>
                  <td className="p-2 flex gap-2">
                    {!slot.isBooked && (
                      <>
                        <button
                          onClick={() => setEditSlot({ ...slot, propertyId: property._id })}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleRemoveSlot(property._id, slot._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                    {slot.bookingStatus === 'pending' && (
                      <>
                        <button
                          onClick={() => handleBookingStatus(slot.bookingId, 'confirmed')}
                          className="text-green-600 hover:text-green-800"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleBookingStatus(slot.bookingId, 'rejected')}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                    {slot.bookingStatus === 'confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(slot.bookingId)}
                        className="text-red-600 hover:text-red-800"
                        title="Cancel Booking"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default BookingManagement;