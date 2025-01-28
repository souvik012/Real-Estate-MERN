import { BrowserRouter, Routes, Route } from 'react-router-dom'

// import './App.css'
import Home from './Pages/Home'
import SignIn from './Pages/SignIn'
import SignOut from './Pages/SignOut'
import Profile from './Pages/Profile'
import About from './Pages/About'

function App() {
  

  return (<BrowserRouter>
    <Routes>
         <Route path='/' element={<Home />}/>
         <Route path='/SignIn' element={<SignIn />}/>
         <Route path='/SignOut' element={<SignOut />}/>
         <Route path='/Profile' element={<Profile />}/>
         <Route path='/About' element={<About />}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
