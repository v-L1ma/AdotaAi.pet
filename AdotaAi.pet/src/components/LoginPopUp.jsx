import styles from './LoginPopUp.module.css'
import { FaFacebook, FaGoogle  } from "react-icons/fa";

function LoginPopUp({onClick}){
    return(

        <div className={styles.container}>
          <button className={styles.closeBtn_mobile} onClick={onClick}><div>X</div></button>
            <form>                
                <h1>Conecte-se na sua conta</h1>
                <h2>Seja bem vindo de volta!</h2>
                <div className={styles.social}>
                  <button disabled>
                  <FaGoogle />
                    google
                  </button>
                  <button disabled>
                    Facebook
                  </button>
                </div>
                <p>ou continue com o seu email</p>
                <input type="text" name="" id="" placeholder="Email" />
                <input type="password" name="" id="" placeholder="Senha" />
                <br />
                <div className={styles.esqueceu}>
                  <p>
                    <input type="checkbox" name="" id="" />
                    Lembrar de mim
                  </p>
                  <p>                    
                    <a href="">Esqueceu sua senha?</a>
                  </p>
                </div>
                <button disabled type='submit'>Log in</button>
                <p>
                  Não possui uma conta? <a href="">Crie uma conta</a>
                </p>
              </form>
              <div className={styles.banner}>
                
              <button className={styles.closeBtn} onClick={onClick}><div>X</div></button>
                <img src="https://www.doglife.com.br/blog/assets/post/convivencia-entre-cachorros-e-gatos-eles-podem-morar-juntos-61fd55bf76950e477610eca4/convivencia-capa.jpg" alt="" />
              </div>
              
        </div>

    )
}

export default LoginPopUp