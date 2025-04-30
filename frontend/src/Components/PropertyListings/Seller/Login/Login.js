import React, { useState, useEffect } from 'react';
import './login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LuBadgeCheck } from "react-icons/lu";
import { LuBadgeX } from "react-icons/lu";
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8070/api/login', {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('SelleruserId', response.data.seller._id);
        setLoginSuccess(true);
        setTimeout(() => {
          navigate(`/sellerPropertyDetails`);
        }, 1000);
      } else {
        setError('Login failed! Please check your username and password.');
      }
    } catch (err) {
      setError('Login failed! Please check your username and password.');
    }
  };
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
        window.location.reload(); 
      }, 1600);

      return () => clearTimeout(timer);
    }
  }, [error]);
  return (
    <div className='auth_continer'>
      <div className='auth_card'>
        <div className='auth_card_lft_img'></div>
        <div className='auth_card_right'>
          <p className='auth_card_topic'>Seller Login</p>
          <form className='auth_card_from' onSubmit={handleLogin}>
            <div className='auth_card_from_input'>
              <label className='auth_card_lable'>Email</label>
              <input
                className='auth_card_input'
                type="email"
                name="email"
                placeholder='Enter your email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='auth_card_from_input'>
              <label className='auth_card_lable'>Password</label>
              <input
                className='auth_card_input'
                type="password"
                name="password"
                placeholder='Enter your password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className='auth_btn'>
              Login
            </button>
          </form>
          <p className='no_accc'>
            If you don't have an account, please{' '}
            <span
              onClick={() => navigate('/sellerRegister')}
              className='no_accc_btn'
            >
              Register
            </span>
          </p>
        </div>
      </div>
      {loginSuccess && (
        <div className='seler_alert_box'>
          <div className='done_alert_box_seller'>
            <p className='alert_name_seller'>Login Successful. Welcome back!</p>
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

export default Login;