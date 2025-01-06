import { useRef } from 'react';
import styles from './LoginPopUp.module.css'
import { FaFacebook, FaGoogle  } from "react-icons/fa";
import api from '../../sevices/api';
import { toast } from 'react-toastify';

function LoginPopUp({onClick}){
    const emailRef = useRef()
    const senhaRef = useRef()

    async function handleSubmit(e){
        e.preventDefault()
        
        try{
         const {data:token} = await api.post('/login', {
            email: emailRef.current.value,
            password: senhaRef.current.value,
          })

          localStorage.setItem('token', token)
          console.log(token)
          toast.success('Login efetuado com sucesso')
         
        }catch(err){
          toast.error('Login e/ou senha inválidos')
        }

        onClick()
    }


    return(

        <div className={styles.container}>
          <button className={styles.closeBtn_mobile} onClick={onClick}><div>X</div></button>
            <form onSubmit={handleSubmit}>                
                <h1>Conecte-se na sua conta</h1>
                <h2>Seja bem vindo de volta!</h2>
                <div className={styles.social}>
                  <button disabled>
                  <FaGoogle />
                    google
                  </button>
                  <button disabled>
                  <FaFacebook/>
                    Facebook
                  </button>
                </div>
                <p>ou continue com o seu email</p>
                <input 
                type="email" 
                placeholder="Email"
                ref={emailRef}
                />
                <input 
                type="password"
                placeholder="Senha" 
                ref={senhaRef}/>
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
                <button className={styles.LogarBtn} type='submit'>Log in</button>
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