import { Link, useNavigate } from "react-router";
import { CgProfile } from "react-icons/cg";
import styles from './MenuPerfil.module.css';

function MenuPerfil({onClick}){

  const navigate = useNavigate();

  function sairDaConta() {
    localStorage.removeItem("token");
    alert("Logout concluido");
    navigate("/");
  }

    return(
        <div className={styles.dropdown}>
        <div className={styles.button}>
         <span><CgProfile/></span>
         <p>Username</p>
        </div>
        <div className={styles.dropdown_options}>
          <p className={styles.opcao}>
            <Link to="/perfil">Meu perfil</Link>
          </p>
          <button className={styles.opcao} type="submit" onClick={sairDaConta}>Sair</button>
        </div>
      </div>
    )
}

export default MenuPerfil