import styles from './CardPet.module.css'

function CardPet({animais}){
    return(
        <div  className={styles.card} key={styles.id}>
                    <div className={styles.imagem}>
                        <img src={animais.foto} alt=""/>
                    </div>
                        <div className={styles.infos}>
                            <h1 className={styles.nome}><a href="">{animais.nome}</a></h1> 
                            
                            <p>{animais.loc}</p>
                        </div>
                    </div>
    )
}

export default CardPet