import { useForm } from "react-hook-form"
import styles from './Cadastro.module.css'
import api from '../../sevices/api'
import {yupResolver} from '@hookform/resolvers/yup'
import { userValidationSchema } from "../../utils/userValidation"
import { toast } from 'react-toastify';

function Cadastro(){
    const { register, handleSubmit, reset, formState: { errors }} = useForm({
        resolver: yupResolver(userValidationSchema)
    })

    const onSubmit = async (data) => {
        
        try{
          await api.post('/cadastro', {
            name: data.fullname,
            email: data.email,
            password: data.password,          
            cpf: data.cpf, 
            birthdate: data.birthdate,
            phone: data.phone
          })

          toast.success("Usuario cadastrado com sucesso")
          reset()     
        }catch(err){
          toast.error("Erro ao cadastrar o usuario")
          console.log(err)
        }
    }

    return(
    
        <div className={styles.container}>

            <form onSubmit={handleSubmit(onSubmit)}>                
                <h1>Crie sua conta</h1>
                <h2>Rápido e fácil!</h2>
                <div className={styles.social}>
                </div>
                <input 
                type="text" 
                placeholder="Nome Completo"
                name="fullname"
                id="fullname"
                {...register('fullname')}
                />
                <div className={styles.erros}>{errors.fullname?.message}</div>
                <input 
                type="text" 
                placeholder="CPF"
                name="cpf"
                id="cpf"
                {...register('cpf')}
                />
                <div className={styles.erros}>{errors.cpf?.message}</div>
                <input 
                type="date" 
                placeholder="Data de nascimento"
                name="birthdate"
                id="birthdate"
                {...register('birthdate')}
                />
                <div className={styles.erros}>{errors.birthdate?.message}</div>
                <input 
                type="tel" 
                placeholder="Telefone"
                name="phone"
                id="phone"
                {...register('phone')}
                />   
                <div className={styles.erros}>{errors.phone?.message}</div>             
                <input 
                type="email" 
                placeholder="Email"
                name="email"
                id="email"
                {...register('email')}
                />
                <div className={styles.erros}>{errors.email?.message}</div>
                <input 
                type="password"
                placeholder="Senha" 
                name="password"
                id="password"
                {...register('password')}
                />
                <div className={styles.erros}>{errors.password?.message}</div>
                 <input 
                type="password"
                placeholder="Confirme sua senha" 
                name="confirmpassword"
                id="confirmpassword"
                {...register('confirmpassword')}
                />
                <div className={styles.erros}>{errors.confirmpassword?.message}</div>
                
                <button className={styles.cadastrarBtn} type='submit'>Cadastrar</button>
            </form>
              
        </div>

    )
}

export default Cadastro