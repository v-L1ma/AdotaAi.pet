import styles from './Home.module.css'
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";


function Home(){
    return(
        <main>
            
            <div className={styles.banner}>
                <img src="https://corredorsolidario.baluxpet.com.br/wp-content/uploads/2018/02/banner-site.jpg" alt="" />
            </div>

            <div>
                <div className={styles.titulo}>
                    <h1>Algumas de nossas fofuras</h1>
                </div>
                <div className={styles.gallery}>

                <IoIosArrowDropleft className={styles.setas}/>
                
                            <div  className={styles.card}>
                                <img src="https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?q=80&w=1372&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt=""/>
                                <div className={styles.infos}>
                                    <h1 className={styles.nome}><a href="">Bob</a> </h1> 
                                    
                                    <p>Santos, São Paulo</p>
                                </div>
                            </div>
                
                            <div  className={styles.card}>
                                <img src="https://images.unsplash.com/photo-1422565096762-bdb997a56a84?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt=""/>
                                
                                <div className={styles.infos}>
                                    <h1 className={styles.nome}><a href="">Mel</a></h1> 
                                    <p>Santos, São Paulo</p>
                                </div>
                            </div>
                
                            <div  className={styles.card}>
                                <img src="https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=1349&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt=""/>
                                <div className={styles.infos}>
                                    <h1 className={styles.nome}><a href="">Feijão</a></h1> 
                                    <p>Santos, São Paulo</p>
                                </div>
                            </div>
                
                            <div  className={styles.card}>
                                <img src="https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt=""/>
                                <div className={styles.infos}>
                                    <h1 className={styles.nome}><a href="">Joaquim</a></h1> 
                                    <p>Santos, São Paulo</p>
                                </div>
                            </div>
                
                            <IoIosArrowDropright className={styles.setas} />
                           
                    </div>
            </div>

            <div className={styles.sobre}>
                <h1>Sobre o nosso projeto:</h1>
                <p>O AdotaAí.Pet é um aplicativo criado para facilitar a adoção e a doação de pet’s, conectando pessoas que buscam reduzir o número de animais abandonados. O aplicativo visa combater o abandono e a superlotação de animais em situação de rua, oferecendo um espaço confiável para quem deseja adotar um pet e para quem precisa doar por questões pessoais.
                A plataforma atende pessoas interessadas em adotar ou doar, criando uma rede de apoio à adoção responsável. Onde as pessoas poderão divulgar, adotar e compartilhar animais para adoção, ampliando as chances de sucesso e contribuindo para a causa animal.</p>
            </div>

        </main>
    )
}

export default Home