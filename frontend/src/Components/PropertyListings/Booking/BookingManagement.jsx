import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaCheck, FaTimes, FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const BookingManagement = () => {
  const sellerId = localStorage.getItem('SelleruserId');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSlot, setNewSlot] = useState({ propertyId: '', date: '', startTime: '', endTime: '' });
  const [editSlot, setEditSlot] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // e.g., "2025-05-07"
  };

  // Helper function to check if a date is in the future or today
  const isFutureDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
    selectedDate.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  };

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

  const handleBookingStatus = async (bookingId, status) => {
    if (status === 'confirmed') {
      setSelectedBookingId(bookingId);
      setShowMapModal(true);
    } else {
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
    }
  };

  const confirmBookingWithLocation = async () => {
    if (!selectedLocation) {
      alert('Please select a location on the map.');
      return;
    }
    try {
      const googleMapsLink = `https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`;
      await axios.put(`http://localhost:8070/propertyBooking/bookings/${selectedBookingId}`, {
        status: 'confirmed',
        locationLink: googleMapsLink
      });
      setProperties(properties.map(property => ({
        ...property,
        availableSlots: property.availableSlots.map(slot =>
            slot.bookingId === selectedBookingId ? { ...slot, bookingStatus: 'confirmed', locationLink: googleMapsLink } : slot
        )
      })));
      setShowMapModal(false);
      setSelectedBookingId(null);
      setSelectedLocation(null);
    } catch (err) {
      setError(err.message);
    }
  };

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

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!isFutureDate(newSlot.date)) {
      alert('Please select a future date or today for the booking slot.');
      return;
    }
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

  const handleUpdateSlot = async (e) => {
    e.preventDefault();
    if (!isFutureDate(editSlot.date)) {
      alert('Please select a future date or today for the booking slot.');
      return;
    }
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

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setSelectedLocation(e.latlng);
      }
    });
    return selectedLocation ? <Marker position={selectedLocation} /> : null;
  };

  if (loading) return <div className="p-6 text-gray-700">Loading...</div>;
  if (error) return <div className="p-6 text-red-700">Error: {error}</div>;

  return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Booking Management</h2>

        {/* Add New Slot Form */}
        <div className="mb-8 p-4 bg-gray-200 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Add New Slot</h3>
          <form onSubmit={handleAddSlot} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
                value={newSlot.propertyId}
                onChange={(e) => setNewSlot({ ...newSlot, propertyId: e.target.value })}
                className="p-2 border border-gray-300 rounded bg-white text-gray-700"
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
                min={getTodayDate()}
                className="p-2 border border-gray-300 rounded bg-white text-gray-700"
                required
            />
            <input
                type="time"
                value={newSlot.startTime}
                onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                className="p-2 border border-gray-300 rounded bg-white text-gray-700"
                required
            />
            <input
                type="time"
                value={newSlot.endTime}
                onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                className="p-2 border border-gray-300 rounded bg-white text-gray-700"
                required
            />
            <button
                type="submit"
                className="col-span-1 md:col-span  md:col-span-4 bg-gray-600 text-gray-200 p-2 rounded hover:bg-gray-700 flex items-center justify-center"
            >
              <FaPlus className="mr-2" /> Add Slot
            </button>
          </form>
        </div>

        {editSlot && (
            <div className="mb-8 p-4 bg-gray-200 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Edit Slot</h3>
              <form onSubmit={handleUpdateSlot} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                    type="date"
                    value={editSlot.date}
                    onChange={(e) => setEditSlot({ ...editSlot, date: e.target.value })}
                    min={getTodayDate()}
                    className="p-2 border border-gray-300 rounded bg-white text-gray-700"
                    required
                />
                <input
                    type="time"
                    value={editSlot.startTime}
                    onChange={(e) => setEditSlot({ ...editSlot, startTime: e.target.value })}
                    className="p-2 border border-gray-300 rounded bg-white text-gray-700"
                    required
                />
                <input
                    type="time"
                    value={editSlot.endTime}
                    onChange={(e) => setEditSlot({ ...editSlot, endTime: e.target.value })}
                    className="p-2 border border-gray-300 rounded bg-white text-gray-700"
                    required
                />
                <div className="col-span-1 md:col-span-3 flex gap-4">
                  <button
                      type="submit"
                      className="bg-gray-600 text-gray-200 p-2 rounded hover:bg-gray-700 flex items-center justify-center"
                  >
                    <FaCheck className="mr-2" /> Save Changes
                  </button>
                  <button
                      type="button"
                      onClick={() => setEditSlot(null)}
                      className="bg-gray-400 text-gray-800 p-2 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
        )}

        {showMapModal && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-200 p-4 rounded-lg shadow-lg w-full max-w-3xl">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Select Property Location</h3>
                <MapContainer
                    center={[6.9271, 79.8612]} // Default to Colombo, Sri Lanka
                    zoom={13}
                    style={{ height: '400px', width: '100%' }}
                >
                  <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MapClickHandler />
                </MapContainer>
                <div className="mt-4 flex gap-4 justify-end">
                  <button
                      onClick={confirmBookingWithLocation}
                      className="bg-gray-600 text-gray-200 p-2 rounded hover:bg-gray-700"
                  >
                    Confirm Location
                  </button>
                  <button
                      onClick={() => {
                        setShowMapModal(false);
                        setSelectedLocation(null);
                        setSelectedBookingId(null);
                      }}
                      className="bg-gray-400 text-gray-800 p-2 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
        )}

        {properties.map(property => (
            <div key={property._id} className="mb-8 p-4 bg-gray-200 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{property.title}</h3>
              <table className="w-full table-auto">
                <thead>
                <tr className="bg-gray-300">
                  <th className="p-2 text-left text-gray-700">Date</th>
                  <th className="p-2 text-left text-gray-700">Time</th>
                  <th className="p-2 text-left text-gray-700">Status</th>
                  <th className="p-2 text-left text-gray-700">Booked By</th>
                  <th className="p-2 text-left text-gray-700">Actions</th>
                </tr>
                </thead>
                <tbody>
                {property.availableSlots.map(slot => (
                    <tr key={slot._id} className="border-b border-gray-300">
                      <td className="p-2 text-gray-800">{new Date(slot.date).toLocaleDateString()}</td>
                      <td className="p-2 text-gray-800">{`${slot.startTime} - ${slot.endTime}`}</td>
                      <td className="p-2">
                        {slot.bookingStatus ? (
                            <span
                                className={`px-2 py-1 rounded text-sm ${
                                    slot.bookingStatus === 'pending' ? 'bg-yellow-300 text-yellow-900' :
                                        slot.bookingStatus === 'confirmed' ? 'bg-green-300 text-green-900' :
                                            'bg-red-300 text-red-900'
                                }`}
                            >
                        {slot.bookingStatus}
                      </span>
                        ) : (
                            <span className="text-gray-600">Available</span>
                        )}
                      </td>
                      <td className="p-2 text-gray-800">
                        {slot.bookedBy ? `${slot.bookedBy.name} (${slot.bookedBy.email})` : '-'}
                      </td>
                      <td className="p-2 flex gap-2">
                        {!slot.isBooked && (
                            <>
                              <button
                                  onClick={() => setEditSlot({ ...slot, propertyId: property._id })}
                                  className="text-yellow-600 hover:text-yellow-800"
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
                                  className="text-gray-700 hover:text-gray-900"
                              >
                                <FaCheck />
                              </button>
                              <button
                                  onClick={() => handleBookingStatus(slot.bookingId, 'rejected')}
                                  className="text-gray-700 hover:text-gray-900"
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