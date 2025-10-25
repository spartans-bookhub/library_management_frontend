import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter} from 'react-router-dom'
import { CustomThemeProvider } from "./context/ThemeContext.jsx";



createRoot(document.getElementById('root')).render(
  <CustomThemeProvider>
    <App />
  </CustomThemeProvider>,
)
