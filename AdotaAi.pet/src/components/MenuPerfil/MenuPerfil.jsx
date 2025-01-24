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
        <div className={styles.profile}>

        <div className={styles.button}>
         <img src={userInfo.Picture || 'https://static-00.iconduck.com/assets.00/profile-circle-icon-512x512-zxne30hp.png'} alt="" />
        </div>

          <div className={styles.menu}>

            <div className={styles.seta}>
            </div>

            <div className={styles.dropdown_options}>

                <h1 className={styles.opcao}>{userInfo.name}</h1>
                <Link to="/perfil"><p className={styles.opcao}>Painel de controle</p></Link>
            
              <button className={styles.opcao} onClick={sairDaConta}>Sair</button>
            </div>
          </div>
        </div>


      <div className={styles.mobile}>
      <Link to="/perfil">
        <div className={styles.button}>
        <p>{userInfo.name}</p>
        
        <span><img src={userInfo.Picture || 'https://www.google.com/url?sa=i&url=https%3A%2F%2Ficonduck.com%2Ficons%2F180867%2Fprofile-circle&psig=AOvVaw3xBWd4H_hZOF_or2GytKTI&ust=1737151798062000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMDPtPCg-4oDFQAAAAAdAAAAABAR'} alt="" /></span>
         
        </div>
      </Link>
      </div>
    </>
    )
}

export default MenuPerfil