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

                    <div className={styles.tags}>
                        {
                            animal.vacinado === 'Sim' &&
                            <Tag categoria={"Vacinado"}/>
                        }
                        {
                            animal.castrado === 'Sim' &&
                            <Tag categoria={"Castrado"}/>
                        }
                        {
                            animal.vermifugado === 'Sim' &&
                            <Tag categoria={"Vermifugado"}/>
                        }
                    </div>

                    <h2>Descrição</h2>
                    <p>{animal.descricao}</p>
                    <h2>Informações do pet</h2>
                    <div className={styles.infos}>
                        
                        <p>Raca: {animal.raca}</p>
                        <p>Sexo: {animal.sexo}</p>
                        <p>Data de nascimento: {animal.datanasc}</p>                        
                        <div className={styles.divbtn}><button className={styles.contato}>Entre em contato com o Dono</button></div>
                    </div>
                </div>
            </div>
            }
        </main>
    )
}

export default PerfilPet
