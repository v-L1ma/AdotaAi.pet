import { Link } from "react-router";
import styles from "./NavBar.module.css";
import { useState } from "react";
import LoginPopUp from "./LoginPopUp";

function NavBar() {
  const [abrirPopup, setAbrirPopup] = useState(false);

  return (
    <header>
      <nav className={styles.nav}>
        <Link to="/">
          <img
            src="https://static.vecteezy.com/ti/vetor-gratis/p1/6720668-cara-de-cachorro-logo-gratis-vetor.jpg"
            alt=""
          />
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
            <Link className={styles.itens} to="/cadastre">
              Cadastre-se
            </Link>
          </li>
        </ul>
      </nav>

      {abrirPopup && (

        <div className={styles.popup}>
          
            <LoginPopUp onClick={() => setAbrirPopup(false)}/>

          
        </div>

      )}
    </header>
  );
}

export default NavBar;