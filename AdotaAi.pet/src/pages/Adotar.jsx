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
            <label htmlFor="">Animal</label>
            <select name="" id="">
              <option value="">Todas as espécies</option>
              <option value="">Cachorro</option>
              <option value="">Gato</option>
            </select>

            <label htmlFor="">Sexo</label>
            <div>
            <input type="checkbox" name="" id="" />
            <label htmlFor="">Macho</label>
            </div>

            <div>
            <input type="checkbox" name="" id="" />
            <label htmlFor="">Fêmea</label>
            </div>
            
            <select name="" id="">
              <option value="">Todos os Sexos</option>
              <option value="">Macho</option>
              <option value="">Fêmea</option>
            </select>

            <select name="" id="">
              <option value="">Todos os portes</option>
              <option value="">Porte pequeno</option>
              <option value="">Porte Médio</option>
              <option value="">Porte Grande</option>
            </select>

            <select name="" id="">
              <option value="">Todos os estados</option>
            </select>

            <select name="" id="">
              <option value="">Todas as cidades</option>
            </select>
            <input type="text" name="" id="" placeholder="Nome do pet" className={styles.name} />

            <button type="submit">Buscar</button>
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
