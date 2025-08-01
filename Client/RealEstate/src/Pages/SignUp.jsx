import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import OAuth from '../Components/OAuth';

function SignUp() {
  const [formdata, setformdata] = useState({});
  const [error, seterror] = useState(null);
  const [loading, setloading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setformdata({
      ...formdata,
      [e.target.id]: e.target.value
    });
  };

  const handleOtpSend = async () => {
    setloading(true);
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
        seterror(data.message);
      } else {
        setOtpSent(true);
        seterror(null);
      }
    } catch (err) {
      seterror('OTP send failed');
    } finally {
      setloading(false);
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!otpSent) return handleOtpSend();

  setloading(true);
  try {
    const signupRes = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...formdata, otp: Number(otp) })

    });
    const signupData = await signupRes.json();
    if (!signupRes.ok) {
      seterror(signupData.message);
    } else {
      navigate('/signin');
    }
  } catch (err) {
    seterror('Signup failed');
  } finally {
    setloading(false);
  }
};


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Username'
          className='border p-3 rounded-lg'
          id='username'
          onChange={handleChange}
        />
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
          {loading ? 'Loading...' : otpSent ? 'Verify & Sign Up' : 'Send OTP'}
        </button>
        <OAuth />
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to='/signin'>
          <span className='text-blue-700'>Sign In</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}
export default SignUp;
