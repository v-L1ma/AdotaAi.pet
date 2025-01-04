import { Link, useNavigate } from "react-router";
import styles from "./Navbar.module.css";
import { useState } from "react";
import LoginPopUp from "../Login/LoginPopUp.jsx";
import CadastroPopUp from "../Cadastro/CadastroPopUp.jsx";
import Logo from "../../assets/logo.png";
import { IoMdMenu } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import MenuPerfil from "../MenuPerfil/MenuPerfil.jsx";
import SlidingPanel from 'react-sliding-side-panel';
import 'react-sliding-side-panel/lib/index.css';


function Navbar() {
  const [abrirLoginPopup, setAbrirLoginPopup] = useState(false);
  const [abrirCadastroPopup, setAbrirCadastroPopup] = useState(false);
  const [abrirMenu, setAbrirMenu] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate()
  

  function abrir(abrirMenu) {
    setAbrirMenu(!abrirMenu);
  }

  function sairDaConta(){
    localStorage.removeItem("token")
    navigate('/')
  }

  return (
    <header>
      <nav className={styles.nav_desktop}>
        <Link to="/">
          <img src={Logo} alt="" />
        </Link>
        <ul>
          <li>
            <Link className={styles.itens} to="/adotar">
              Quero adotar
            </Link>
          </li>
          <li>
            <Link className={styles.itens} to="/doar">
              Quero doar
            </Link>
          </li>
          <li>
            <Link className={styles.itens} to="/ongs">
              Ongs por perto
            </Link>
          </li>
        </ul>

        {token ? (
          <MenuPerfil/>
        ) : (
          <ul>
            <li>
              <a
                className={styles.itens}
                onClick={() => setAbrirLoginPopup(!abrirLoginPopup)}
              >
                Login
              </a>
            </li>
            <li >
                <Link to="/cadastro">Cadastre-se</Link>
            </li>
          </ul>
        )}
      </nav>

      <nav className={styles.nav_mobile}>
        <div className={styles.top_header}>
          <Link to="/">
            <img src={Logo} alt="" />
          </Link>

          <button onClick={() => abrir(abrirMenu)}>
            <IoMdMenu />
          </button>
        </div>

        <SlidingPanel
        type={'right'}
        isOpen={abrirMenu}
        size={60}
        >
        <div className={styles.container_list}>
            <button onClick={() => abrir(abrirMenu)}>X</button>
            <ul>
              <li>
                <Link className={styles.itens} to="/adotar">
                  Quero adotar
                </Link>
              </li>
              <li>
                <Link className={styles.itens} to="/doar">
                  Quero doar
                </Link>
              </li>
              <li>
                <Link className={styles.itens} to="/ongs">
                  Ongs por perto
                </Link>
              </li>

              {token ? (
                <button className={styles.logout} onClick={() => sairDaConta()}>
                  <IoLogOutOutline />
                </button>
              ) : (
                <ul>
                  <li>
                    <a
                      className={styles.itens}
                      onClick={() => {
                        setAbrirLoginPopup(!abrirLoginPopup)
                        setAbrirMenu(!abrirMenu)
                    }}
                    >
                      Login
                    </a>
                  </li>
                  <li >
                      <Link to="/cadastro">Cadastre-se</Link>
                  </li>
                </ul>
              )}
            </ul>
          </div>
        </SlidingPanel>

        

      </nav>

      {abrirLoginPopup && (
        <div className={styles.popup}>
          <LoginPopUp onClick={() => setAbrirLoginPopup(!abrirLoginPopup)} />
        </div>
      )}

      {abrirCadastroPopup && (
        <div className={styles.popup}>
          <CadastroPopUp
            onClick={() => setAbrirCadastroPopup(!abrirCadastroPopup)}
          />
        </div>
      )}
    </header>
  );
}

export default Navbar;
