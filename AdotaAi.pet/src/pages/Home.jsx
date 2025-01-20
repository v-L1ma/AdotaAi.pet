
import Banner from "../components/Banner/Banner";
import styles from "./Home.module.css";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import Galeria from "../components/GaleriaPets/Galeria";

function Home() {


  return (
    <div>
      <Banner/>
      <main>
      
      
        <div>
          <div className={styles.titulo}>
            <h1>Algumas de nossas fofuras</h1>
          </div>
          <div className={styles.gallery}>
            
            <Galeria/>
           
          </div>
        </div>
        <div className={styles.sobre}>
          <h1>Sobre o nosso projeto:</h1>
          <p>
            O AdotaAí.Pet é um aplicativo criado para facilitar a adoção e a
            doação de pet’s, conectando pessoas que buscam reduzir o número de
            animais abandonados. O aplicativo visa combater o abandono e a
            superlotação de animais em situação de rua, oferecendo um espaço
            confiável para quem deseja adotar um pet e para quem precisa doar por
            questões pessoais. A plataforma atende pessoas interessadas em adotar
            ou doar, criando uma rede de apoio à adoção responsável. Onde as
            pessoas poderão divulgar, adotar e compartilhar animais para adoção,
            ampliando as chances de sucesso e contribuindo para a causa animal.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Home;
