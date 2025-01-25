import { BrowserRouter as Router, Routes, Route } from "react-router";
import React, { Suspense, lazy, useState, useEffect } from "react";
import "./App.css";
import Footer from "./components/Footer";
const LazyOngs = lazy(() => import("./pages/Ongs"));
const LazyHome = lazy(() => import("./pages/Home"));
const LazPerfilPet = lazy(() => import("./pages/PerfilPet/PerfilPet"));
const LazyCadastro = lazy(() => import("./pages/Cadastro/Cadastro"));
const LazyPerfil = lazy(() => import("./pages/PerfilTutor/Perfil"));
const LazyEditar = lazy(() => import("./pages/PerfilTutor/Menus/Editar/Editar"));
const LazySenha = lazy(() => import("./pages/PerfilTutor/Menus/Senha"));
const LazyFavoritos = lazy(() => import("./pages/PerfilTutor/Menus/Favoritos"));
const LazyGerenciar = lazy(() => import("./pages/PerfilTutor/Menus/Gerenciar"));
import Navbar from "./components/Navbar/Navbar";
import AuthContext from "./context/AuthContext";
import Loader from "./components/Loader/Loader";

const LazyAdotar = lazy(() => import("./pages/Adotar"));
const LazyDoar = lazy(() => import("./pages/Doar"));

function App() {
  const [userInfo, setUserInfo] = useState(() => {
    const savedState = localStorage.getItem("userInfo");
    return savedState ? JSON.parse(savedState) : { user: null };
  });

  useEffect(() => {
    // Salvar no localStorage sempre que o estado mudar
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }, [userInfo]);

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo }}>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={
            <Suspense fallback={<Loader />}>
                <LazyHome />
            </Suspense>
            
            } />
          <Route
            path="/adotar"
            element={
              <Suspense fallback={<Loader />}>
                <LazyAdotar />
              </Suspense>
            }
          />
          <Route path="/adotar/animal/:id" element={
            <Suspense fallback={<Loader />}>
              <LazPerfilPet />
            </Suspense>     
            }/>
          <Route
            path="/doar" 
            element={
              <Suspense fallback={<Loader />}>
                <LazyDoar />
                </Suspense>
            }
          />
          <Route path="/ongs" element={
            <Suspense fallback={<Loader />}>
            <LazyOngs />
            </Suspense>
            } />
          <Route path="/cadastro" element={
            <Suspense fallback={<Loader />}>
            <LazyCadastro />
            </Suspense>
            } />
          <Route path="/perfil" element={
            <Suspense fallback={<Loader />}>
            <LazyPerfil />
            </Suspense>
            }>
            <Route path="Editar" element={
              <Suspense fallback={<Loader />}>
              <LazyEditar />
              </Suspense>
          } />
            <Route path="Alterar-senha" element={
              <Suspense fallback={<Loader />}>
              <LazySenha />
              </Suspense>
          } />
            <Route path="Favoritos" element={
              <Suspense fallback={<Loader />}>
              <LazyFavoritos />
              </Suspense>
          } />
            <Route path="Gerenciar" element={
              <Suspense fallback={<Loader />}>
              <LazyGerenciar />
              </Suspense>
          } />
          </Route>
        </Routes>

        <Footer />
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
