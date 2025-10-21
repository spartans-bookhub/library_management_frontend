import { useState } from 'react'
// import 'bootstrap/dist/css/bootstrap.min.css';
/* The following line can be included in a src/App.scss */

import './App.css'
// import UserProfile from './components/user/userprofile'
import Registration from './components/user/registration'
import { Routes , Route} from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Login from './components/user/Login';
import ResetPassword from './components/user/ResetPassword'


function App() {
  const [count, setCount] = useState(0)

  return (
  <>
    <div>

    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
    </Routes>
    </div> 
        
   </>
   
  )
}

export default App
