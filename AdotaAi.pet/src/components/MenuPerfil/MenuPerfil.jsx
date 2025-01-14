import { Link, useNavigate } from "react-router";
import { CgProfile } from "react-icons/cg";
import styles from './MenuPerfil.module.css';
import  { toast } from 'react-toastify';
import { useContext } from "react";
import AuthContext from '../../context/AuthContext.jsx';


function MenuPerfil({onClick}){

  const navigate = useNavigate()

  function sairDaConta(){
    localStorage.removeItem("token")
    toast.success('Conta desconectada com sucesso')
    navigate('/')
  }
  const {userInfo, setUserInfo} = useContext(AuthContext)

    return(
      <>
        <div className={styles.dropdown}>
        <div className={styles.button}>
         <img src={`https://drive.google.com/thumbnail?id=${userInfo.Picture}`} alt="" />
        </div>
        <div className={styles.dropdown_options}>
          
            <Link to="/perfil"><p className={styles.opcao}>Meu perfil</p></Link>
          
          <button className={styles.opcao} onClick={sairDaConta}>Sair</button>
          
        </div>
      </div>

      <div className={styles.mobile}>
      <Link to="/perfil">
        <div className={styles.button}>
         <span><img src={`https://drive.google.com/thumbnail?id=${userInfo.Picture}`} alt="" /></span>
         <p>Olá, Username</p>
        </div>
      </Link>
      </div>
    </>
    )
}

export default MenuPerfil