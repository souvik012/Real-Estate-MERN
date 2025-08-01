import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signinstart, signinsuccess, signinfailure } from '../redux/user/userslice.js';
import OAuth from '../Components/OAuth.jsx';

function SignIn() {
  const [formdata, setformdata] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setformdata({
      ...formdata,
      [e.target.id]: e.target.value
    });
  };

  const handleOtpSend = async () => {
    try {
      const res = await fetch('/api/auth/generate-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: formdata.email })
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(signinfailure(data.message));
      } else {
        setOtpSent(true);
      }
    } catch (err) {
      dispatch(signinfailure('OTP send failed'));
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!otpSent) return handleOtpSend();

  try {
    dispatch(signinstart());
    const otpRes = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: formdata.email, otp })
    });
    const otpData = await otpRes.json();
    if (!otpRes.ok) {
      dispatch(signinfailure(otpData.message));
      return;
    }

    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ ...formdata, otp })  // ✅ FIXED LINE
    });

    const data = await res.json();
    if (!res.ok) {
      dispatch(signinfailure(data.message));
      return;
    }

    dispatch(signinsuccess(data));
    navigate('/');
  } catch (error) {
    dispatch(signinfailure(error.message));
  }
};


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='email'
          placeholder='Email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />
        {otpSent && (
          <input
            type='text'
            placeholder='Enter OTP'
            className='border p-3 rounded-lg'
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        )}
        <button
          disabled={loading}
          className='bg-sky-900 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : otpSent ? 'Verify & Sign In' : 'Send OTP'}
        </button>
        <OAuth />
      </form>

      <div className='text-right mt-2'>
        <Link to='/forgot-password' className='text-blue-700'>Forgot Password?</Link>
      </div>

      <div className='flex gap-2 mt-5'>
        <p>Don't have an account?</p>
        <Link to='/signup'>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>

      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}
export default SignIn;
