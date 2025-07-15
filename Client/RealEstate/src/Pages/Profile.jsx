import { useSelector } from 'react-redux';
import { useRef } from 'react';
import { useState } from 'react';
import { 
  updateuserstart,
  updateusersuccess,
  updateuserfailure } from '../redux/user/userslice';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/user/userslice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Listing from '../../../../api/Models/listing.midel';


 function Profile() {
  const navigate = useNavigate();
  const fileRef = useRef(null)
  const { currentuser } = useSelector((state) => state.user);
  const [formdata , setformdata] = useState({})
  const [showListingError , setShowListingError] = useState(false)
  const [userListings , setUserListings] = useState({})
  const dispatch  = useDispatch()
  console.log(formdata);
  
  const handlechange = (e) =>{
    setformdata({...formdata, [e.target.id]: e.target.value})

  };
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      dispatch(updateuserstart());
      const res = await fetch(`/api/user/update/${currentuser._id}`,{
        method: 'POST',
        headers:{
          'Content-Type':'application/json'
        },
        credentials: 'include',
        body:JSON.stringify(formdata),
      })
      const data = await res.json();
      if(data.success == false){
        dispatch(updateuserfailure(data.message))
        return
      }
      dispatch(updateusersuccess(data))
      toast.success("Profile updated successfully");

    } catch (error) {
      dispatch(updateuserfailure(error.message))
      
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(file){
    setformdata({ ...formdata, avatar: file });
    }
  };
 
  
  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      try {
        const res = await fetch(`/api/user/delete/${currentuser._id}`, {
          method: 'DELETE',
          credentials: 'include', // if using cookies
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        const data = await res.json();
  
        if (res.ok) {
          dispatch(logout());
          navigate('/signin');
          toast.success("Account deleted successfully");
        } else {
          toast.error(data.message || "Something went wrong");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        toast.error("Failed to delete account");
      }
    }
  };
  const handleShowListing = async() => {
    
    if (userListings && userListings.length > 0) {
      setUserListings([]); // hide listings
      return;
    }

    try {
      setShowListingError(false)
      const res = await fetch(`/api/user/listing/${currentuser._id}`)
      const data = await res.json();
      if(data.success === false){
        setShowListingError(true);
        return;
      }
      
      setUserListings(data);
    } catch (error) {
      setShowListingError(true)  
    }

  }
  const handleListingDelete = async (listingId) => {
    const confirmed = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmed) return;
    
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        credentials: 'include', // make sure cookies are sent if using JWT in cookies
      });
  
      const data = await res.json();
  
      if (!res.ok || data.success === false) {
        toast.error(data.message || "Failed to delete listing");
        return;
      }
  
      // Remove listing from state 
      setUserListings((prev) => prev.filter((item) => item._id !== listingId));
      toast.success("Listing deleted successfully");
  
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while deleting");
    }
  };
  


  
  return (
    <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

      <input type="file" ref={fileRef} hidden accept='image/*' />

      <img onClick={()=>fileRef.current.click()} src={currentuser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
     
      <input type="text" placeholder='username' defaultValue={currentuser.username} id='username' className='border p-3 rounded-lg ' onChange={handlechange}  />
      <input type="email" placeholder='email' id='email' defaultValue={currentuser.email} className='border p-3 rounded-lg ' onChange={handlechange}  />
      <input type="text" placeholder='password' id='password' className='border p-3 rounded-lg ' onChange={handlechange}  />

      <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>update</button>
      <Link className='bg-sky-900 text-white p-3 rounded-lg uppercase text-center hover:opacity-90' to={"/create-listing"}>
        Create Listing
      </Link>
    </form>
    
    <div className="flex justify-between mt-5">
      <span className='text-red-700 cursor-pointer' onClick={handleDeleteAccount}> Delete Account
</span>
      <span className='text-red-700 cursor-pointer' onClick={() => {
           dispatch(logout());
       }}>Sign out
       </span>
    </div>
    
    <button onClick={handleShowListing} 
    className='text-sky-900 w-full'>
       Show Listing
    </button>
    <p className='text-red-700 mt-5'> 
      {showListingError ? 'Error showing listing' : ''}

    </p>

    {userListings && userListings.length > 0 &&


    <div className='flex flex-col gap-4'>

          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>

      {userListings.map((listing) => {
    console.log('Full listing object:', listing);
    

    

    return (
      <div key={listing._id} className='border rounded-lg p-3 flex
       justify-between items-center gap-4'>
        <Link to={`/listing/${listing._id}`}>
          <img
            src={listing.imageUrls?.[0] || '/placeholder.png'} // fallback image
            alt="listing cover"
            className="w-16 h-16 object-contain 
            "
          />
        </Link>
        <Link to = {`/listing/${listing._id}`}>
         
          <p className='text-blue-700 font-semibold  hover:underline truncate flex-1'>{listing.name}</p>

        </Link>

        <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-sky-900 uppercase'>Edit</button>
                </Link>
              </div>
         
      </div>
    );
      })}

    </div>
    }




  </div>
    

  )
}
export default Profile