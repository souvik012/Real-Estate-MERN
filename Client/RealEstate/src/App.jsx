import { BrowserRouter, Routes, Route } from 'react-router-dom'

// import './App.css'
import Home from './Pages/Home'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import Profile from './Pages/Profile'
import About from './Pages/About'
import Header from './Components/Header'
import PrivateRoute from './Components/PrivateRoute'
function App() {
  

  return (<BrowserRouter>
    <Header />
    <Routes>
         <Route path='/' element={<Home />}/>
         <Route path='/SignIn' element={<SignIn />}/>
         <Route path='/SignUp' element={<SignUp />}/>
         <Route element={<PrivateRoute />}>
         <Route path='/Profile' element={<Profile />}/>
         </Route>
         <Route path='/About' element={<About />}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
