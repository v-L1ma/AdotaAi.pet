import { useEffect, useState } from "react";
import CardPet from "../components/CardPet";
import styles from "./Adotar.module.css";
import api from "../sevices/api";
import Loader from "../components/Loader/Loader";
import ilustracao from '../assets/adotarIlustration.png'

function Adotar() {
  const [animais, setAnimais] = useState([])  
  const [filterAnimal, SetFilterAnimal] = useState("Todos")
  const [filterSexo, SetFilterSexo] = useState("Todos")
  const token = localStorage.getItem('token')
  const [isLoading, setIsLoading] = useState(true)

  async function listaAnimais(){

    const animaisFromApi = await api.get('/animais', {
      headers: {Authorization: `Bearer ${token}`}
    })
    setAnimais(animaisFromApi.data)
    setIsLoading(false)
  }

  useEffect(() => {

    listaAnimais()

  }, [])

  return (
    <main className={styles.main}>
      <h1 className={styles.titulo}>Encontre seu novo amigo</h1>
      <div className={styles.disponiveis}>

        <div className={styles.filtros}>
          <form className={styles.filtrosdiv}>
            <h2>Filtros</h2>

            <h3>Animal</h3>

            <div className={styles.checkbox}>
              <input onChange={(e)=>{SetFilterAnimal(e.target.value)}} type="checkbox" value="Cachorro" name="Cachorro" id="Cachorro"/>
              <label htmlFor="Cachorro">Cachorro</label>
            </div>

            <div className={styles.checkbox}>
              <input onChange={(e)=>{SetFilterAnimal(e.target.value)}}  type="checkbox" value="Gato"  name="gato" id="gato" />
              <label htmlFor="gato">Gato</label>
            </div>

            <h3>Sexo</h3>
            <div className={styles.checkbox}>
            <input onClick={(e)=>SetFilterSexo(e.target.value)} value="Macho" type="checkbox" name="Macho"/>
            <label htmlFor="">Macho</label>
            </div>

            <div className={styles.checkbox}>
            <input onClick={(e)=>SetFilterSexo(e.target.value)} value="Femea" type="checkbox" name="Femea"/>
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

            <button className={styles.limpar} type="reset" onClick={(e)=>{SetFilterSexo('Todos'); SetFilterAnimal('Todos')}}>Limpar filtros</button>
            
          </form>

          

        </div>              
        
          { token
          ?
          <div className={styles.containerGallery}>

            {
              isLoading &&
              <Loader/>
            }
            
            <div className={styles.gallery}>
            
              {
            animais
            .filter((animais) =>
              filterAnimal === 'Todos' // If the filter is 'Todos', return all animals
              ? true
              : filterAnimal === 'Cachorro' // If the filter is 'cachorro', only return animals that are 'cachorro'
              ? animais.animal === 'Cachorro'
              : animais.animal === 'Gato' // If the filter is 'gato', only return animals that are 'gato'
            )
            
            .filter((animais) =>
              filterSexo === 'Todos'
                ? true // Retorna todos os animais se o filtro for 'Todos'
                : filterSexo === 'Macho'
                ? animais.sexo === 'Macho'
                : animais.sexo === 'Femea'
            )
            .map((animais) => (
              <CardPet animais={animais} key={animais.id} />
            ))
            }
            </div>
          </div>
          :
          <div className={styles.aviso}>
            <img src={ilustracao} alt="" loading="lazy"/>
            <p>Faça login para conhecer todas as nossas fofuras precisando de um lar!</p>
          </div>       
          }
        </div>
      
    </main>
  );
}

export default Adotar;
