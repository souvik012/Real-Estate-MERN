import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import React from 'react'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signinsuccess } from '../redux/user/userslice'
import {useNavigate} from 'react-router-dom'

export default function OAuth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogleClick = async()=> {
     try {
        const provider = new GoogleAuthProvider()
        const auth = getAuth(app)
 
        const result = await signInWithPopup(auth,provider)

        console.log("this is the oauth result",result);

        const res = await fetch('/api/auth/google',{
            method:'post',
            headers:{
                'Content-Type':'application/json',
            },
            credentials: 'include',
            body:JSON.stringify({
                name:result.user.displayName,
                email:result.user.email,
                photo:result.user.photoURL,
            }),
        })
        const data = await res.json()
        console.log("OAuth - Backend Response:", data); // ✅ Debugging
        dispatch(signinsuccess(data))
        console.log(data);
        
        navigate('/')

     } catch (error) {
        console.log('could not sign in with google',error);
        
     }
    }
  return (
    <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg 
    uppercase hover:bg-red-500'>Continue with google</button>
  )
}
