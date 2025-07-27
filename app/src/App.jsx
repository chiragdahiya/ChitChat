import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/homepage'
import Login from './pages/Login'
import ProfilePage from './pages/ProfilePage'
import img from './assets/bgImage.svg'
import {Toaster} from 'react-hot-toast'
import { AuthContext } from '../context/authContext'
const App = () => {

const{authUser} = useContext(AuthContext)
  return (
    <div className=" bg-contain" style={{ backgroundImage: `url(${img})` }}> 
    <Toaster/>
      <Routes>

        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login"/>} />
        <Route path='/login' element={!authUser ? <Login/> : <Navigate to="/"/>} />
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to="/login"/>} />
      </Routes>
    </div>
  )
}

export default App
