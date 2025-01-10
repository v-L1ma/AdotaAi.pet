import { Link, useNavigate } from "react-router";
import { CgProfile } from "react-icons/cg";
import styles from './MenuPerfil.module.css';
import  { toast } from 'react-toastify';


function MenuPerfil({onClick}){

  const navigate = useNavigate()

  function sairDaConta(){
    localStorage.removeItem("token")
    toast.success('Conta desconectada com sucesso')
    navigate('/')
  }

    return(
      <>
        <div className={styles.dropdown}>
        <div className={styles.button}>
         <span><CgProfile/></span>
        </div>
        <div className={styles.dropdown_options}>
          <p className={styles.opcao}>
            <Link to="/perfil">Meu perfil</Link>
          </p>
          <button className={styles.opcao} onClick={sairDaConta}>Sair</button>
          
        </div>
      </div>

      <div className={styles.mobile}>
      <Link to="/perfil">
        <div className={styles.button}>
         <span><CgProfile/></span>
         <p>Olá, Username</p>
        </div>
      </Link>
      </div>
    </>
    )
}

export default MenuPerfil