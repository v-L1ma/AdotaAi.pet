import Banner from "../components/Banner/Banner";
import styles from "./Home.module.css";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import Galeria from "../components/GaleriaPets/Galeria";
import CaoeGato from "../assets/Cao-e-gato.png";
import { FaSquareCheck } from "react-icons/fa6";

function Home() {
  return (
    <div>
      <Banner />
      <main>
        <div className={styles.container}>
          <div className={styles.imagem}>
            <img src={CaoeGato} alt="" />
          </div>

          <div className={styles.sobre}>
            <div className={styles.content}>
              <h1>sobre nós</h1>
              <h2>NÓS TEMOS ORGULHO DE PODER AJUDAR OS SEUS PETS</h2>
              <p>
                O AdotaAí.Pet visa combater o abandono e a superlotação de
                animais em situação de rua, oferecendo um espaço confiável para
                quem deseja adotar um pet e para quem precisa doar por questões
                pessoais.
              </p>

              <div className={styles.vantagens}> 
                <div>
                  <span><FaSquareCheck/></span>
                  <p>Ambiente seguro</p>
                </div>
                <div>
                  <span><FaSquareCheck/></span>
                  <p>Praticidade</p>
                </div>
                <div>
                  <span><FaSquareCheck/></span>
                  <p>Cuidado com seu pet</p>
                </div>
                <div>
                <span><FaSquareCheck/></span>
                  <p>Menos animais nas ruas</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Home;
