import { useRef } from 'react'
import styles from './CadastroPopUp.module.css'
import api from '../../sevices/api'
import { useNavigate } from 'react-router'

function CadastroPopUp({onClick}){
    const nomeRef = useRef()
    const emailRef = useRef()
    const senhaRef = useRef()
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()
        
        try{
          await api.post('/cadastro', {
            name: nomeRef.current.value,
            email: emailRef.current.value,
            password: senhaRef.current.value,
          })

          alert("Usuario cadastrado com sucesso")
          navigate('/')
        }catch(err){
            alert("Erro ao cadastrar o usuario")
            console.log(err)
        }
    }

    return(
    
        <div className={styles.container}>

            <form onSubmit={handleSubmit}>                
                <h1>Crie sua conta</h1>
                <h2>Rápido e fácil!</h2>
                <div className={styles.social}>
                </div>
                <input 
                type="text" 
                placeholder="Nome Completo"
                ref={nomeRef}
                required
                />
                <input 
                type="text" 
                placeholder="CPF"
                />
                <input 
                type="date" 
                placeholder="Data de nascimento"
                />
                <input 
                type="tel" 
                placeholder="Telefone"
                />                
                <input 
                type="email" 
                placeholder="Email"
                ref={emailRef}
                required
                />
                <input 
                type="password"
                placeholder="Senha" 
                ref={senhaRef}
                required/>
                 <input 
                type="password"
                placeholder="Confirme sua senha" 
                />
                
                <button className={styles.cadastrarBtn} type='submit'>Cadastrar</button>
            </form>
              <div className={styles.banner}>
                
              <button className={styles.closeBtn} onClick={onClick}><div>X</div></button>
                <img src="https://www.doglife.com.br/blog/assets/post/convivencia-entre-cachorros-e-gatos-eles-podem-morar-juntos-61fd55bf76950e477610eca4/convivencia-capa.jpg" alt="" />
              </div>
              
        </div>

    )
}

export default CadastroPopUp