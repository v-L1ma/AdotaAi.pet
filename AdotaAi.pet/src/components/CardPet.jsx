import styles from './CardPet.module.css'
import { Link } from "react-router";
import { Navigate } from 'react-router-dom';



function CardPet({animais}){
    
    return(
        <div  className={styles.card} key={animais.id}>
            <Link to={`/adotar/animal/${animais.id}`}>
                    <div className={styles.imagem}>
                        <img src={animais.foto || "https://img.freepik.com/vetores-premium/nenhuma-foto-disponivel-icone-vetorial-simbolo-de-imagem-padrao-imagem-em-breve-para-site-ou-aplicativo-movel_87543-10615.jpg"} alt=""/>
                    </div>
                        <div className={styles.infos}>
                            <h1 className={styles.nome}>
                                {animais.nome}
                            </h1> 
                            
                        </div>
            </Link>            
        </div>
    )
}

export default CardPet