import { Link, useNavigate} from "react-router";
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
import { toast } from "react-toastify";


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
    toast.success('Conta desconectada com sucesso')
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
            <li>
                <Link className={styles.itens} to="/cadastro">Cadastre-se</Link>
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
        type='right'
        isOpen={abrirMenu}
        size={80}
        >
        <div className={styles.container_list}>
            <button className={styles.close} onClick={() => abrir(abrirMenu)}>X</button>
            <ul>
              {
                token && (                  
                <li>
                <MenuPerfil/>
                </li>
                )
              }
            <Link className={styles.itens} to="/adotar">  
              <li>
                Quero adotar
              </li>
              </Link>
              <Link className={styles.itens} to="/doar">
              <li>
                  Quero doar
              </li>
              </Link>
              <Link className={styles.itens} to="/ongs">
              <li>
                  Ongs por perto
              </li>
              </Link>

              {token ? (
                <>
                <button className={styles.logout} onClick={() => sairDaConta()}>                
                  <p><IoLogOutOutline /> Sair</p>
                </button>
                </>
              ) : (
                <ul>
                  <a
                      className={styles.itens}
                      onClick={() => {
                        setAbrirLoginPopup(!abrirLoginPopup)
                        setAbrirMenu(!abrirMenu)
                    }}
                    >
                  <li>                    
                      Login
                  </li>
                  </a>
                  <Link to="/cadastro">
                  <li >
                      Cadastre-se
                  </li>
                  </Link>
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
