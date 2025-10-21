import { useState } from 'react'
// import 'bootstrap/dist/css/bootstrap.min.css';
/* The following line can be included in a src/App.scss */

import './App.css'
// import UserProfile from './components/user/userprofile'
import Registration from './components/user/registration'
import { BrowserRouter, Routes , Route} from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Login from './components/user/Login';


function App() {
  const [count, setCount] = useState(0)

  return (
  <>

    <div>

    <Login />
  
  <Registration />

     <Navbar />
    
    </div> 
        
   </>
   
  )
}

export default App
