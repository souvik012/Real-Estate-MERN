import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
// import './App.css'
import Home from './Pages/Home'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import Profile from './Pages/Profile'
import About from './Pages/About'
import Header from './Components/Header'
import PrivateRoute from './Components/PrivateRoute'
import CreateListing from './Pages/CreateListing';
import UpdateListing from './Pages/UpdateListing';
import Listing from './Pages/Listing';
function App() {
  

  return (<BrowserRouter>
    <Header />
    <Routes>
         <Route path='/' element={<Home />}/>
         <Route path='/SignIn' element={<SignIn />}/>
         <Route path='/SignUp' element={<SignUp />}/>
         <Route element={<PrivateRoute />}>
         <Route path='/Profile' element={<Profile />}/>
         <Route path='/create-listing' element={<CreateListing />}/>
         <Route path='/update-listing/:listingId' element={<UpdateListing/>}></Route>
         </Route>
         <Route path='/About' element={<About />}/>
         <Route path='/listing/:listingId' element={<Listing />}/>
    </Routes>
    <>
      {/* your routes/components */}
      <ToastContainer position="top-center" />
    </>
    </BrowserRouter>
  )
}

export default App
