import styles from './Loader.module.css'

function Loader(){
    return(
        <div className={styles.container}>
        <div className={styles.loading}></div>
        <p>Carregando...</p>
        </div>
    )
}

export default Loader

