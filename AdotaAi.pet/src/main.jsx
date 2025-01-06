import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Toastdiv from './components/Toastdiv/Toastdiv.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>      
    <App />   
    <Toastdiv/>
  </StrictMode>,
)
