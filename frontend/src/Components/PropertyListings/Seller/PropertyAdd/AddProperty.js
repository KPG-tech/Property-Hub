import React, { useState, useEffect } from 'react';
import './AddProperty.css';
import { useNavigate } from 'react-router-dom';

function AddProperty() {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    price: '',
    phone: '',
    address: '',
    description: '',
    sellerID: '',
  });
  
  // Add state for time slots
  const [timeSlots, setTimeSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    const SelleruserId = localStorage.getItem('SelleruserId');
    if (SelleruserId) {
      setFormData((prev) => ({ ...prev, sellerID: SelleruserId }));
    }
  }, []);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    if (images.length + files.length > 4) {
      alert('You can only upload up to 4 images.');
      return;
    }
    const newImages = files.map((file) => ({
      id: URL.createObjectURL(file),
      file,
    }));
    setImages([...images, ...newImages]);
  };

  const handleRemoveImage = (id) => {
    setImages(images.filter((image) => image.id !== id));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle time slot changes
  const handleSlotChange = (e) => {
    setNewSlot({ ...newSlot, [e.target.name]: e.target.value });
  };

  const addTimeSlot = () => {
    if (newSlot.date && newSlot.startTime && newSlot.endTime) {
      setTimeSlots([...timeSlots, { ...newSlot, isBooked: false }]);
      setNewSlot({ date: '', startTime: '', endTime: '' });
    } else {
      alert('Please fill all time slot fields');
    }
  };

  const removeTimeSlot = (index) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('type', formData.type);
    data.append('price', formData.price);
    data.append('phone', formData.phone);
    data.append('address', formData.address);
    data.append('description', formData.description);
    data.append('sellerID', formData.sellerID);
    data.append('availableSlots', JSON.stringify(timeSlots)); // Add time slots
    images.forEach((image) => {
      data.append('images', image.file);
    });

    try {
      const response = await fetch('http://localhost:8070/api/addproperty', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        alert('Property added successfully');
        navigate(`/sellerPropertyDetails`);
        setFormData({
          title: '',
          type: '',
          price: '',
          phone: '',
          address: '',
          description: '',
          sellerID: '',
        });
        setImages([]);
        setTimeSlots([]);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Error adding property');
    }
  };

  return (
    <div>
      <div>
        <p className='add_pro_topic'>Add new Property</p>
        <form className="addpropertyfrom" onSubmit={handleSubmit}>
          <div className='auth_card_from_input'>
            <label className='auth_card_lable'>Title</label>
            <input className='auth_card_input' type="text" name="title"
              placeholder='Enter your title' required value={formData.title} onChange={handleChange} />
          </div>

          <div className='auth_card_from_input'>
            <label className='auth_card_lable'>Property Type</label>
            <select className='auth_card_input' name="type" required value={formData.type} onChange={handleChange}>
              <option value="" disabled>Select a type</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          <div className='auth_card_from_input'>
            <label className='auth_card_lable'>Price</label>
            <input className='auth_card_input' type="number" name="price"
              placeholder='Enter price' required value={formData.price} onChange={handleChange} />
          </div>

          <div className='auth_card_from_input'>
            <label className='auth_card_lable'>Phone Number</label>
            <input className='auth_card_input'
              type="text"
              name="phone"
              placeholder='Enter phone number' required 
              value={formData.phone}
              onChange={(e) => {
                const re = /^[0-9\b]{0,10}$/;
                if (re.test(e.target.value)) {
                  handleChange(e);
                }
              }}
              maxLength="10"
              pattern="[0-9]{10}"
              title="Please enter exactly 10 digits."
               />
          </div>

          <div className='auth_card_from_input'>
            <label className='auth_card_lable'>Address</label>
            <textarea className='auth_card_input' name="address"
              placeholder='Enter address' required rows={3} value={formData.address} onChange={handleChange} />
          </div>

          <div className='auth_card_from_input'>
            <label className='auth_card_lable'>Description</label>
            <textarea className='auth_card_input' name="description"
              placeholder='Enter property details (Bedrooms, Bathrooms, Size)' required rows={5} value={formData.description} onChange={handleChange} />
          </div>

          <div className='auth_card_from_input'>
            <label className='auth_card_lable'>Images</label>
            <p className='condi'>You need upload 4 images.</p>
            <input
              className='auth_card_input'
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </div>
          <div className="selected-images">
            {images.map((image) => (
              <div key={image.id} className="image_preview">
                <img src={image.id} alt="Selected" className="preview-img" />
                <button type="button" className="remove_btn" onClick={() => handleRemoveImage(image.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className='auth_card_from_input'>
            <label className='auth_card_lable'>Available Time Slots</label>
            <div className="time-slot-inputs">
              <input
                type="date"
                name="date"
                value={newSlot.date}
                onChange={handleSlotChange}
                className='auth_card_input'
              />
              <input
                type="time"
                name="startTime"
                value={newSlot.startTime}
                onChange={handleSlotChange}
                className='auth_card_input'
              />
              <input
                type="time"
                name="endTime"
                value={newSlot.endTime}
                onChange={handleSlotChange}
                className='auth_card_input'
              />
              <button type="button" className="from_btn" onClick={addTimeSlot}>
                Add Slot
              </button>
            </div>
            
            {/* Display added time slots */}
            <div className="time-slots-list">
              {timeSlots.map((slot, index) => (
                <div key={index} className="time-slot-item">
                  <span>
                    {new Date(slot.date).toLocaleDateString()} {slot.startTime} - {slot.endTime}
                  </span>
                  <button
                    type="button"
                    className="remove_btn"
                    onClick={() => removeTimeSlot(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button className='from_btn' type="submit">Add Property</button>
        </form>
      </div>
    </div>
  );
}

export default AddProperty;