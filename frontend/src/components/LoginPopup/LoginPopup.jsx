import React, { useState, useContext } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // ✅ Add this

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const navigate = useNavigate(); // ✅ Use this

  const [currState, setCurrState] = useState('Login');
  const [data, setData] = useState({ name: '', email: '', password: '' });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setData({ name: '', email: '', password: '' });
  };

  const onLogin = async (event) => {
    event.preventDefault();

    const endpoint = currState === 'Login' ? '/api/user/login' : '/api/user/register';

    try {
      const response = await axios.post(url + endpoint, data);
      console.log('✅ Backend response:', response.data);

      if (response.data.success) {
        toast.success(`${currState} successful!`);

        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);

        clearForm();
        setShowLogin(false);

        // ✅ Navigate to homepage after login/register
        navigate("/");

        // Optional: switch to login mode after register
        if (currState === 'Sign Up') {
          setCurrState('Login');
        }
      } else {
        toast.error(response.data.message || `${currState} failed.`);
      }
    } catch (error) {
      console.error('❌ Error during auth:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className='login-popup-container'>
        <div className='login-popup-title'>
          <h2>{currState}</h2>
          <img
            src={assets.cross_icon}
            alt='Close'
            className='close-icon'
            onClick={() => {
              setShowLogin(false);
              clearForm();
              setCurrState('Login');
            }}
          />
        </div>

        <div className='login-popup-inputs'>
          {currState === 'Sign Up' && (
            <input
              name='name'
              type='text'
              placeholder='Your Name'
              value={data.name}
              onChange={onChangeHandler}
              required
            />
          )}
          <input
            name='email'
            type='email'
            placeholder='Your Email'
            value={data.email}
            onChange={onChangeHandler}
            required
          />
          <input
            name='password'
            type='password'
            placeholder='Password'
            value={data.password}
            onChange={onChangeHandler}
            required
          />
        </div>

        <button type='submit'>
          {currState === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>

        <div className='login-popup-condition'>
          <input type='checkbox' required />
          <p>By continuing I agree to the Terms of Use & Privacy Policy.</p>
        </div>

        {currState === 'Login' ? (
          <p>
            Don't have an account?{' '}
            <span onClick={() => { clearForm(); setCurrState('Sign Up'); }}>
              Click here
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <span onClick={() => { clearForm(); setCurrState('Login'); }}>
              Login here
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
