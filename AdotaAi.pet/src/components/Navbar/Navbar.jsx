import styles from "./Navbar.module.css";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import LoginPopUp from "../Login/LoginPopUp.jsx";
import Logo from "../../assets/logo.png";
import MenuPerfil from "../MenuPerfil/MenuPerfil.jsx";
import SlidingPanel from "react-sliding-side-panel";
import "react-sliding-side-panel/lib/index.css";
import { toast } from "react-toastify";
import { FaRegHeart } from "react-icons/fa";
import { BsBox2Heart } from "react-icons/bs";
import { IoMdMenu } from "react-icons/io";
import { IoLogOutOutline, IoLocationOutline, IoSettingsOutline, IoClose } from "react-icons/io5";

function Navbar() {
  const [abrirLoginPopup, setAbrirLoginPopup] = useState(false);
  const [abrirCadastroPopup, setAbrirCadastroPopup] = useState(false);
  const [abrirMenu, setAbrirMenu] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  function abrir(abrirMenu) {
    setAbrirMenu(!abrirMenu);
  }

  function sairDaConta() {
    localStorage.removeItem("token");
    toast.success("Conta desconectada com sucesso");
    navigate("/");
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
          <MenuPerfil />
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
              <Link className={styles.itens} to="/cadastro">
                Cadastre-se
              </Link>
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

        <SlidingPanel type="right" isOpen={abrirMenu} size={80}>
          <div className={styles.container_list}>
            <button className={styles.close} onClick={() => abrir(abrirMenu)}>
              <p><IoClose/></p>
            </button>
            <ul>
              {token && (
                <>
                <li>
                  <MenuPerfil />
                </li>

                <hr />

                </>
              )}             

              <Link
                onClick={() => abrir(abrirMenu)}
                className={styles.itens}
                to="/adotar"
              >
                <li>
                  Adotar{" "}
                  <span>
                    <FaRegHeart />
                  </span>
                </li>
              </Link>
              <Link
                onClick={() => abrir(abrirMenu)}
                className={styles.itens}
                to="/doar"
              >
                <li>
                  Doar{" "}
                  <span>
                    <BsBox2Heart />
                  </span>
                </li>
              </Link>
              <Link
                onClick={() => abrir(abrirMenu)}
                className={styles.itens}
                to="/ongs"
              >
                <li>
                  ONGs{" "}
                  <span>
                    <IoLocationOutline  className={styles.locationIcon}/>
                  </span>
                </li>
              </Link>

              <hr />

              {token ? (
                <>
                <Link
                onClick={() => abrir(abrirMenu)}
                className={styles.itens}
                to="/perfil"
              >
                <li>
                  Ajustes{" "}
                  <span>
                  <IoSettingsOutline />
                  </span>
                </li>
              </Link>
                  <button
                    className={styles.logout}
                    onClick={() => {
                      sairDaConta();
                      abrir(abrirMenu);
                    }}
                  >
                    <p>
                      Sair{" "}
                      <span>
                        <IoLogOutOutline />
                      </span>{" "}
                    </p>
                  </button>
                </>
              ) : (
                <ul>
                  <a
                    className={styles.itens}
                    onClick={() => {
                      setAbrirLoginPopup(!abrirLoginPopup);
                      setAbrirMenu(!abrirMenu);
                    }}
                  >
                    <li>Login</li>
                  </a>
                  <Link to="/cadastro">
                    <li>Cadastre-se</li>
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
