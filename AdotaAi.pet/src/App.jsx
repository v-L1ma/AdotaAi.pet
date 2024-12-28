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
import Perfil from './pages/PerfilTutor/Perfil';
import Editar from './pages/PerfilTutor/Menus/Editar';
import Senha from './pages/PerfilTutor/Menus/Senha';
import Favoritos from './pages/PerfilTutor/Menus/Favoritos'
import Gerenciar from './pages/PerfilTutor/Menus/Gerenciar'

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
              <Route path='/perfil' element={<Perfil/>}>
                  <Route path="Editar" element={<Editar/>}/>
                  <Route path="Alterar-senha" element={<Senha/>}/>
                  <Route path="Favoritos" element={<Favoritos/>}/>
                  <Route path="Gerenciar" element={<Gerenciar/>}/>
              </Route>


            </Routes>
            
          <Footer/>
      </Router>
  )
}

export default App
