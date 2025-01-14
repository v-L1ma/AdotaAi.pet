import { useContext, useState } from 'react';
import styles from './Editar.module.css'
import { MdEdit } from "react-icons/md";
import AuthContext from '../../../../context/AuthContext';

function Editar(){

    const [isDisabled, setIsDisabled] = useState(true)
    const {userInfo, setUserInfo} = useContext(AuthContext)

    function alterarDados(isDisabled){
        setIsDisabled(!isDisabled)
    }

    return(
        <div className={styles.container}>
            <div className={styles.foto}>
                <img src={`https://drive.google.com/thumbnail?id=${userInfo.Picture}`} alt="" />
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
                        <input type="text" placeholder={userInfo.name} disabled={isDisabled}/>
                    </div>
                    <div>
                        <h2>Email</h2>
                        <input type="text" placeholder={userInfo.email} disabled={isDisabled}/>
                        
                    </div>
                    <div>
                        <h2>Telefone</h2>
                        <input type="text" placeholder={userInfo.phone} disabled={isDisabled}/>
                        
                    </div>
                    <div>
                        <h2>CPF</h2>
                        <input type="text" placeholder={userInfo.cpf} disabled={isDisabled}/>
                       
                    </div>
                    <div>
                        <h2>Data de nascimento</h2>
                        <input type="text" placeholder={userInfo.birthdate} disabled={isDisabled}/>
                                             
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Editar