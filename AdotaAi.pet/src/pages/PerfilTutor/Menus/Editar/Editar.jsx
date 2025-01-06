import { useState } from 'react';
import styles from './Editar.module.css'
import { MdEdit } from "react-icons/md";

function Editar(){
    const userPhoto = "https://plus.unsplash.com/premium_photo-1682096259050-361e2989706d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

    const [backgroundImage, setBackgroundImage] = 
    useState(`url(${userPhoto})`);
    const [isDisabled, setIsDisabled] = useState(true)

    function alterarDados(isDisabled){
        setIsDisabled(!isDisabled)
    }

    return(
        <div className={styles.container}>
            <div className={styles.foto}>
                <div className={styles.photofield} style={{
                     backgroundImage: backgroundImage
                     
                }}>
                </div>

                <div>
                <button>Alterar foto</button>
                <p>Recomendado 800x800, no mínimo. <br /> JPG ou PNG são permitidos.</p>
                </div>
            </div>

            <div className={styles.info}>
                <div className={styles.header}>
                    <h1>Informações pessoais</h1>
                    <button onClick={()=>alterarDados(isDisabled)} className={styles.teste}><MdEdit /></button>
                </div>
                <div className={styles.dados}>
                    <div>
                        <h2>Nome completo</h2>
                        <input type="text" placeholder='nome' disabled={isDisabled}/>
                    </div>
                    <div>
                        <h2>Email</h2>
                        <input type="text" placeholder='Lorem ipsum@hotmail.com' disabled={isDisabled}/>
                        
                    </div>
                    <div>
                        <h2>Telefone</h2>
                        <input type="text" placeholder='(12)12345-6789' disabled={isDisabled}/>
                        
                    </div>
                    <div>
                        <h2>CPF</h2>
                        <input type="text" placeholder='123.456.789-10' disabled={isDisabled}/>
                       
                    </div>
                    <div>
                        <h2>Data de nascimento</h2>
                        <input type="text" placeholder='05/01/2025' disabled={isDisabled}/>
                                             
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Editar