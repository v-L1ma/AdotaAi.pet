import styles from './CardPet.module.css'
import { Link } from "react-router";
import { Navigate } from 'react-router-dom';



function CardPet({animais}){
    
    return(
        <div  className={styles.card} key={animais.id}>
                    <div className={styles.imagem}>
                        <img src={animais.foto} alt=""/>
                    </div>
                        <div className={styles.infos}>
                            <h1 className={styles.nome}>
                                <Link to={`/adotar/animal/${animais.id}`}>{animais.nome}</Link>
                            </h1> 
                            
                        </div>
                    </div>
    )
}

export default CardPet