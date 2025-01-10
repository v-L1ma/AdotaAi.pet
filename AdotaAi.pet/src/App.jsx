import { BrowserRouter as Router, Routes, Route} from 'react-router'
import React, { createContext, useState, useEffect } from 'react';
import './App.css'
import Footer from './components/Footer'
import Adotar from './pages/Adotar'
import Doar from './pages/Doar'
import Ongs from './pages/Ongs'
import Home from './pages/Home'
import PerfilPet from './pages/PerfilPet/PerfilPet'
import Cadastro from './pages/Cadastro/Cadastro'
import Perfil from './pages/PerfilTutor/Perfil';
import Editar from './pages/PerfilTutor/Menus/Editar/Editar';
import Senha from './pages/PerfilTutor/Menus/Senha';
import Favoritos from './pages/PerfilTutor/Menus/Favoritos'
import Gerenciar from './pages/PerfilTutor/Menus/Gerenciar'
import Navbar from './components/Navbar/Navbar'
import AuthContext from './context/AuthContext'



function App() {

    
  const [userInfo, setUserInfo] = useState(() => {

    const savedState = localStorage.getItem('userInfo');
    return savedState ? JSON.parse(savedState) : { user: null };
  });

  useEffect(() => {
    // Salvar no localStorage sempre que o estado mudar
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }, [userInfo]);

  return (
    <AuthContext.Provider value={{userInfo, setUserInfo}}>
      <Router> 

          <Navbar/>

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
      </AuthContext.Provider>
  )
}

export default App
