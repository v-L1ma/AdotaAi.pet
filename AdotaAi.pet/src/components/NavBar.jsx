import { Link } from "react-router";
import styles from "./NavBar.module.css";
import { useState } from "react";
import LoginPopUp from "./LoginPopUp";
import Logo from "../assets/logo.png";
import { IoMdMenu } from "react-icons/io";

function NavBar() {
  const [abrirPopup, setAbrirPopup] = useState(false);
  const [abrirMenu, setAbrirMenu] = useState(false);

  function abrir(abrirMenu) {
    setAbrirMenu(!abrirMenu);
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

        <ul>
          <li>
            <a className={styles.itens} onClick={() => setAbrirPopup(true)}>
              Login
            </a>
          </li>
          <li>
            <Link className={styles.itens} to="/cadastro">
              Cadastre-se
            </Link>
          </li>
        </ul>
      </nav>

      <nav className={styles.nav_mobile}>
        <div className={styles.top_header}>
          <Link to="/">
            <img src={Logo} alt="" />
          </Link>

          <button onClick={()=>abrir(abrirMenu)}>
            <IoMdMenu />
          </button>
        </div>
        {abrirMenu && (
          <div className={styles.container_list}>
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
              <li>
                <a className={styles.itens} onClick={() => setAbrirPopup(true)}>
                  Login
                </a>
              </li>
              <li>
                <Link className={styles.itens} to="/cadastro">
                  Cadastre-se
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {abrirPopup && (
        <div className={styles.popup}>
          <LoginPopUp onClick={() => setAbrirPopup(false)} />
        </div>
      )}
    </header>
  );
}

export default NavBar;
