import { useState } from 'react'
import './App.css'
import UserProfile from './components/user/userprofile'
import Registration from './components/user/registration'
import { BrowserRouter, Routes , Route} from 'react-router-dom'
import Navbar from './components/common/navbar'
import ResetPasswordPage from './components/user/resetpassword'
import EditProfile from './components/user/editprofile'


function App() {
  const [count, setCount] = useState(0)

  return (
  <>
   <BrowserRouter>
    <Navbar/>
       <Routes>
        <Route path="/register" element={<Registration/>}/>
        {/* <Route path="/login" element={<Login/>}/>*/}  
        <Route path="/userprofile" element = {<EditProfile/>}/> 
        <Route path="/reset-password" element={<ResetPasswordPage />} />     
       </Routes>
    </BrowserRouter>
        
   </>
   
  )
}

export default App
