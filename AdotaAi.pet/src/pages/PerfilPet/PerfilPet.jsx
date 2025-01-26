import { useEffect, useState } from 'react';
import styles from './PerfilPet.module.css'
import { FaLocationDot } from "react-icons/fa6";
import api from "../../sevices/api"
import { useParams } from 'react-router-dom';
import Tag from '../../components/Tag/Tag';
import Loader from '../../components/Loader/Loader'


function PerfilPet(){

    const { id } = useParams()
    const [animal, setAnimal] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const token = localStorage.getItem('token')
   

    async function infoAnimal(id){

        const infoFromApi =  await api.get(`/animais/${id}`, {
            headers: {Authorization: `Bearer ${token}`}
          })
        setAnimal(infoFromApi.data)
        setIsLoading(false)
    }

    useEffect(() => {

        infoAnimal(id)
    
      }, [])


    return(
        <main>
            {
                isLoading ?
                    <div className={styles.containerLoading}>
                        <Loader/>
                    </div>
                : 
            
            <div className={styles.container}>
                <img src={animal.Picture || "https://img.freepik.com/vetores-premium/nenhuma-foto-disponivel-icone-vetorial-simbolo-de-imagem-padrao-imagem-em-breve-para-site-ou-aplicativo-movel_87543-10615.jpg"} alt="foto do pet" loading='lazy'/>
                <div className={styles.sobre}>
                    <div>
                        <h1>{animal.nome}</h1>
                        <p className={styles.loc}><FaLocationDot/>Santos, SP</p>
                    </div>

                   <div>
                        <h2>Descrição</h2>
                        <p>{animal.descricao}</p>
                    </div> 

                    <div className={styles.infos}>
                    <h2>Informações do pet</h2>
                    
                        
                        <p><span>Raca:</span> {animal.raca}</p>
                        <p><span>Sexo:</span> {animal.sexo}</p>
                        <p><span>Data de nascimento:</span> {animal.datanasc}</p>    
                        <p><span>Vacinado:</span> {animal.vacinado}</p>   
                        <p><span>Castrado:</span> {animal.castrado}</p>   
                        <p><span>Vermifugado:</span> {animal.vermifugado}</p>   

                        <div className={styles.divbtn}><button className={styles.contato}>Entre em contato com o Dono</button></div>
                    </div>

                    
                </div>
            </div>
            }
        </main>
    )
}

export default PerfilPet
