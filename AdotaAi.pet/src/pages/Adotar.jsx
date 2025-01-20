import { useEffect, useState } from "react";
import CardPet from "../components/CardPet";
import styles from "./Adotar.module.css";
import api from "../sevices/api";

function Adotar() {
  const [animais, setAnimais] = useState([]) 
  const token = localStorage.getItem('token')

  async function listaAnimais(){

    const animaisFromApi = await api.get('/animais', {
      headers: {Authorization: `Bearer ${token}`}
    })
    setAnimais(animaisFromApi.data)
  }

  useEffect(() => {

    listaAnimais()

  }, [])

  return (
    <main className={styles.main}>
      <h1>Encontre seu novo amigo</h1>
      <div className={styles.disponiveis}>

        <div className={styles.filtros}>
          <div className={styles.filtrosdiv}>
            <h2>Filtros</h2>

            <h3>Animal</h3>

            <div className={styles.checkbox}>
              <input type="checkbox" name="Cachorro" id="Cachorro"/>
              <label htmlFor="Cachorro">Cachorro</label>
            </div>

            <div className={styles.checkbox}>
              <input type="checkbox" name="gato" id="gato" />
              <label htmlFor="gato">Gato</label>
            </div>

            <h3>Sexo</h3>
            <div className={styles.checkbox}>
            <input type="checkbox" name="" id="" />
            <label htmlFor="">Macho</label>
            </div>

            <div className={styles.checkbox}>
            <input type="checkbox" name="" id="" />
            <label htmlFor="">Fêmea</label>
            </div>
            
            <h3>Porte</h3>
            <div className={styles.checkbox}>
              <input type="checkbox" name="pequeno" id="pequeno" />
              <label htmlFor="pequeno">Pequeno</label>
            </div>
            <div className={styles.checkbox}>
              <input type="checkbox" name="medio" id="medio" />
              <label htmlFor="medio">Médio</label>
            </div>
            <div className={styles.checkbox}>
              <input type="checkbox" name="grande" id="grande" />
              <label htmlFor="grande">Grande</label>
            </div>
            
          </div>
        </div>
        
          { token
          ?
          <div className={styles.gallery}>
            {
          animais.map((animais) => (
            <CardPet animais={animais} key={animais.id} />
          ))
          }
          </div>
          :
          <div className={styles.aviso}>
            <img src="https://img.freepik.com/vetores-gratis/ilustracao-de-esterilizacao-de-animais-desenhada-a-mao_23-2150085163.jpg?t=st=1735249740~exp=1735253340~hmac=0afaa402654c3433b6eb8ab46c481f935e0625e2b15d0662b1f2e2e238b94815&w=826" alt="" />
            <p>Faça login para conhecer todas as nossas fofuras precisando de um lar!</p>
          </div>
          
          

          }
        </div>
      
    </main>
  );
}

export default Adotar;
