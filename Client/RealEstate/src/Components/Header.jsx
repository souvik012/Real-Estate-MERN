import {FaSearch} from 'react-icons/fa'
import {Link , useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'

import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

function Header() {
  const {currentuser} = useSelector(state =>state.user)
  const [searchTerm , setSearchTerm] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  console.log("Current User:", currentuser);
  console.log("Avatar URL from Redux:", currentuser?.avatar);
  

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className='bg-sky-200 shadow-md'>

     <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
     <Link to='/'>
       <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
       <span className='text-sky-900'>Land</span>
       <span className='text-gray-600'>Queue</span>
      
       </h1>
      </Link>
            {/* Search Bar Wrapper */}

     {/* this div is changed */}
      <div className="flex-1 flex justify-center">
       <form onSubmit={handleSubmit} className='bg-slate-100 p-2 rounded-lg flex items-center' >
         
        <input 
        type="text" 
        placeholder='Search...'
        className='bg-transparent focus:outline-none w-24 sm:w-64'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button>
           <FaSearch className='text-sky-900'/>
        </button>  
       </form>
       </div>
       {/* list of home to sign in */}

       <ul className='flex items-center space-x-4'>
        <Link to='/'><li className='text-sky-900 hidden sm:inline hover:underline'>Home</li></Link>
        <Link to='/about'><li className='text-sky-900 hidden sm:inline hover:underline'>About</li></Link>
        {/* <Link to='/contact'><li className='text-sky-900 hidden sm:inline hover:underline'>Contact</li></Link> */}
        <Link to='/Profile'>
         {currentuser?(
          <img
          className='rounded-full h-7 w-7 object-cover'
          src={currentuser.avatar}
          alt='Profile'
        />
        
         ):(
          <li className='text-sky-900 sm:inline hover:underline'>Sign In</li>
         )}
        </Link>
        {/* <Link to='/profile'><li className='text-sky-900 hidden sm:inline hover:underline'>Profile</li></Link> */}

       </ul>

      
     </div>
    </header>
  )
}
export default Header