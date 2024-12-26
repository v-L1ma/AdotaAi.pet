import { useRef } from 'react'
import styles from '../components/LoginPopUp.module.css'
import api from '../sevices/api'

function Cadastro(){
    const nomeRef = useRef()
    const emailRef = useRef()
    const senhaRef = useRef()

    async function handleSubmit(e){
        e.preventDefault()
        
        try{
          await api.post('/cadastro', {
            name: nomeRef.current.value,
            email: emailRef.current.value,
            password: senhaRef.current.value,
          })

          alert("Usuario cadastrado com sucesso")
        }catch(err){
            alert("Erro ao cadastrar o usuario")
            console.log(err)
        }
    }

    return(
    
        <div className={styles.container}>

            <form onSubmit={handleSubmit}>                
                <h1>Conecte-se na sua conta</h1>
                <h2>Seja bem vindo de volta!</h2>
                <div className={styles.social}>
                </div>
                <p>ou continue com o seu email</p>
                <input 
                type="text" 
                placeholder="Nome Completo"
                ref={nomeRef}
                />
                <input 
                type="text" 
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
                <button type='submit'>Log in</button>
                <p>
                  Não possui uma conta? <a href="">Crie uma conta</a>
                </p>
              </form>
              <div className={styles.banner}>
                
              <button className={styles.closeBtn}><div>X</div></button>
                <img src="https://www.doglife.com.br/blog/assets/post/convivencia-entre-cachorros-e-gatos-eles-podem-morar-juntos-61fd55bf76950e477610eca4/convivencia-capa.jpg" alt="" />
              </div>
              
        </div>

    )
}

export default Cadastro