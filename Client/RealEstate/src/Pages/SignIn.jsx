// import React, { useState } from 'react'
import { Link , useNavigate} from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signinstart , signinsuccess , signinfailure} from '../redux/user/userslice.js'

 function signin() {

  const [formdata , setformdata] = useState({})
  const {loading,error} = useSelector((state)=>state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
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
      dispatch(signinstart());
      const res = await fetch ('/api/auth/signin',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formdata),
      })
      const data = await res.json();
      console.log(data);
      
      if(data.success === false){
        dispatch(signinfailure(data.message))
        return
      }
      
      
  
      
      dispatch(signinsuccess(data))
      navigate('/');

    } catch (error) {
      dispatch(signinfailure(error.message))
    }
    
   }

  console.log(formdata);
  
  

  return (
   <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

      

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
      {loading ? 'loading..': 'Sign In'}</button>
    </form>
    <div className='flex gap-2 mt-5'>
      <p>Don't have an account?</p>
      <Link to={"/signup"}>
      <span className='text-blue-700'>Sign Up</span>
      </Link>
    </div>
    {error && <p className='text-red-500 mt-5'>{error}</p>}
   </div>
  )
}
export default signin