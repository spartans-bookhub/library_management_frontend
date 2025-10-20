import { useState } from 'react'
import './App.css'
import UserProfile from './components/user/userprofile'
import Registration from './components/user/registration'
import { BrowserRouter, Routes , Route} from 'react-router-dom'
import Navbar from './components/common/navbar'


function App() {
  const [count, setCount] = useState(0)

  return (
  <>
   <BrowserRouter>
    <Navbar/>
       <Routes>
        <Route path="/register" element={<Registration/>}/>
        {/* <Route path="/login" element={<Login/>}/>
        <Route path="/userprofile" element = {<UserProfile/>}/> */}       
       </Routes>
    </BrowserRouter>
        
   </>
   
  )
}

export default App
