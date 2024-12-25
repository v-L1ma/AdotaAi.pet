import { BrowserRouter as Router, Routes, Route} from 'react-router'
import { useState } from 'react'
import './App.css'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Adotar from './pages/Adotar'
import Doar from './pages/Doar'
import Ongs from './pages/Ongs'
import Home from './pages/Home'
import PerfilPet from './pages/PerfilPet/PerfilPet'
import Cadastro from './pages/Cadastro'

function App() {

  return (
      <Router>

          <NavBar/>

            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/adotar" element={<Adotar/>}/>
              <Route path="/adotar/animal/:id" element={<PerfilPet/>}/>
              <Route path="/doar" element={<Doar/>}/>
              <Route path="/ongs" element={<Ongs/>}/>
              <Route path="/cadastro" element={<Cadastro/>}/>
            </Routes>
            
          <Footer/>
      </Router>
  )
}

export default App
