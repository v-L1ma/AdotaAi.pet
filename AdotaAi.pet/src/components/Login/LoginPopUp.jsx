import { useContext, useRef, useState } from 'react';
import styles from './LoginPopUp.module.css'
import { FaFacebook, FaGoogle  } from "react-icons/fa";
import api from '../../sevices/api';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import { Link} from "react-router";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

function LoginPopUp({onClick}){
    const emailRef = useRef()
    const senhaRef = useRef()

    const {setUserInfo} = useContext(AuthContext)
    const [showPassword, setShowPassword] = useState("password")

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

    function changeType(showPassword){
      if (showPassword === "password") {
        setShowPassword("text")
      } else {
        setShowPassword("password")
      }
    }


    return(

        <div className={styles.container}>
          <button className={styles.closeBtn_mobile} onClick={onClick}><div>X</div></button>
            <form onSubmit={handleSubmit}>                
                <div>
                  <h1>Conecte-se na sua conta</h1>
                  <h2>Seja bem vindo de volta!</h2>
                </div>
        
                <div className={styles.inputs}>
                  <label htmlFor="email">Email</label>
                  <input
                  id='email'
                  type="email"
                  placeholder="Email"
                  ref={emailRef}
                  />
                  <label htmlFor="senha">Senha</label>
                  <div className={styles.divInput}>
                    <input
                    id='senha'
                    type={showPassword}
                    placeholder="Senha"
                    ref={senhaRef}/>
                    <div className={styles.showPassword} onClick={()=> changeType(showPassword)}><IoMdEye/></div>
                   
                  </div>
                </div>
                <div className={styles.esqueceu}>
                <div>
                  <input type="checkbox" name="" id="" />
                    <p>
                      Lembrar de mim
                    </p>
                </div>
                  <p>                    
                    <Link to="/">Esqueceu sua senha?</Link>
                  </p>
                </div>
                <button className={styles.LogarBtn} type='submit'>Log in</button>
                <p>
                  Não possui uma conta? <Link onClick={onClick} to='/cadastro' >Crie uma conta</Link>
                </p>
              </form>
              <div className={styles.banner}>
                
              <button className={styles.closeBtn} onClick={onClick}><div>X</div></button>
                
              </div>
              
        </div>

    )
}

export default LoginPopUp