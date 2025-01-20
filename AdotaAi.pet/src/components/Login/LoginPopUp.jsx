import { useContext, useRef } from 'react';
import styles from './LoginPopUp.module.css'
import { FaFacebook, FaGoogle  } from "react-icons/fa";
import api from '../../sevices/api';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import { Link} from "react-router";

function LoginPopUp({onClick}){
    const emailRef = useRef()
    const senhaRef = useRef()

    const {setUserInfo} = useContext(AuthContext)

    async function handleSubmit(e){
        e.preventDefault()
        
        try{
         const response = await api.post('/login', {
            email: emailRef.current.value,
            password: senhaRef.current.value,
          })
          

          localStorage.setItem('token', response.data.token)
          setUserInfo(response.data.user)
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
        
                <div className={styles.inputs}>
                  <input
                  type="email"
                  placeholder="Email"
                  ref={emailRef}
                  />
                  <input
                  type="password"
                  placeholder="Senha"
                  ref={senhaRef}/>
                </div>
                <div className={styles.esqueceu}>
                <div>
                  <input type="checkbox" name="" id="" />
                    <p>
                      Lembrar de mim
                    </p>
                </div>
                  <p>                    
                    <a href="">Esqueceu sua senha?</a>
                  </p>
                </div>
                <button className={styles.LogarBtn} type='submit'>Log in</button>
                <p>
                  Não possui uma conta? <Link to='/cadastro' >Crie uma conta</Link>
                </p>
              </form>
              <div className={styles.banner}>
                
              <button className={styles.closeBtn} onClick={onClick}><div>X</div></button>
                
              </div>
              
        </div>

    )
}

export default LoginPopUp