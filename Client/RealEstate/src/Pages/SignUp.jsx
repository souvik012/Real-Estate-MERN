// import React, { useState } from 'react'
import { Link , useNavigate} from 'react-router-dom'
import { useState } from 'react'
import OAuth from '../Components/OAuth';

 function SignUp() {

  const [formdata , setformdata] = useState({})
  const [error , seterror] = useState(null)
  const [loading , setloading] = useState(false);
  const navigate = useNavigate()
  const handleChange = (e)=>{
    setformdata(
      {
        ...formdata,
        [e.target.id]:e.target.value
      }
    )

  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      setloading(true);
      const res = await fetch ('/api/auth/signup',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formdata),
      })
      const data = await res.json();
      console.log(data);
      
      if(data.success === false){
        seterror(data.message);
        setloading(false)
        return
      }
      setloading(false);
      
  
      if(data.success === false){
        seterror(data.message)
        setloading(false)
        seterror(null);
        return
      }
      setloading(false)

      seterror(null);
      navigate('/signin');

    } catch (error) {
      setloading(false)
      seterror(error.message)
    }
    
   }

  console.log(formdata);
  
  

  return (
   <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

      <input 
      type="username" 
      placeholder='username'
      className='border p-3 rounded-lg' 
      id='username' 
      onChange={handleChange}  />

      <input 
      type="email" 
      placeholder='email'
      className='border p-3 rounded-lg' 
      id='email'
      onChange={handleChange}  />

      <input 
      type="password" 
      placeholder='password'
      className='border p-3 rounded-lg' 
      id='password'
      
      onChange={handleChange}  />

      <button disabled={loading} className='bg-sky-900 text-white p-3 rounded-lg uppercase 
      hover:opacity-95 disabled:opacity-80'>
      {loading ? 'loading..': 'Sign Up'}</button>
    <OAuth/>
    </form>
    <div className='flex gap-2 mt-5'>
      <p>Have an account?</p>
      <Link to={"/signin"}>
      <span className='text-blue-700'>Sign In</span>
      </Link>
    </div>
    {error && <p className='text-red-500 mt-5'>{error}</p>}
   </div>
  )
}
export default SignUp