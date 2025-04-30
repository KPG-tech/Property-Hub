import React, { useState, useEffect } from 'react';
import { LuBadgeCheck } from "react-icons/lu";
import { LuBadgeX } from "react-icons/lu";
function Register() {
  const [regSuccess, setRegSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    email: '',
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhoneNumber(formData.phone)) {
      setError('Invalid phone number format');
      return;
    }

    try {
      const response = await fetch('http://localhost:8070/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 201) {
        setRegSuccess(true);
        setTimeout(() => {
          window.location.href = '/sellerLogin';
        }, 1000);
      } else {
        setError('Registration failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
        window.location.reload();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [error]);
  return (
    <div className='auth_continer_reg'>
      <div className='auth_card'>
        <div className='auth_card_right'>
          <p className='auth_card_topic'>Seller Register</p>
          <form className='auth_card_from_reg' onSubmit={handleSubmit}>
            <div className='auth_card_from_input'>
              <label className='auth_card_lable'>Full Name</label>
              <input
                className='auth_card_input'
                type="text"
                name="fullname"
                placeholder='Enter your fullname'
                value={formData.fullname}
                onChange={(e) => {
                  const re = /^[A-Za-z\s]*$/;
                  if (re.test(e.target.value)) {
                    handleChange(e);
                  }
                }}
                required
              />
            </div>
            <div className='auth_card_from_input'>
              <label className='auth_card_lable'>Phone</label>
              <input
                className='auth_card_input'
                type="text"
                name="phone"
                placeholder='Enter your phone number'
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
                required
              />
            </div>
            <div className='auth_card_from_input'>
              <label className='auth_card_lable'>Email</label>
              <input
                className='auth_card_input'
                type="email"
                name="email"
                placeholder='Enter your email'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className='auth_card_from_input'>
              <label className='auth_card_lable'>User Name</label>
              <input
                className='auth_card_input'
                type="text"
                name="username"
                placeholder='Enter your username'
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className='auth_card_from_input'>
              <label className='auth_card_lable'>Password</label>
              <input
                className='auth_card_input'
                type="password"
                name="password"
                placeholder='Enter your password'
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className='auth_btn'>Register</button>
          </form>
          <p className='no_accc'>if you already have an account please <span onClick={() => (window.location.href = '/sellerLogin')} className='no_accc_btn'>Login</span></p>
        </div>
        <div className='auth_reg_card_lft_img'></div>
      </div>
      {regSuccess && (
        <div className='seler_alert_box'>
          <div className='done_alert_box_seller'>
            <p className='alert_name_seller'>Register Successful. Please Login !</p>
            <LuBadgeCheck className='alert_icon_seller' />
          </div>
        </div>
      )}

      {error && (
        <div className='seler_alert_box'>
          <div className='no_alert_box_seller'>
            <p className='alert_name_seller'>{error}</p>
            <LuBadgeX className='alert_icon_seller' />
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;