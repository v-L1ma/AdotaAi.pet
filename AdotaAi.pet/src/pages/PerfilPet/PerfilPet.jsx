import { useEffect, useState } from 'react';
import styles from './PerfilPet.module.css'
import { FaLocationDot } from "react-icons/fa6";
import api from "../../sevices/api"
import { useParams } from 'react-router-dom';

function PerfilPet(){

    const { id } = useParams()
    const [animal, setAnimal] = useState([])

    const token = localStorage.getItem('token')
   

    async function infoAnimal(id){

        const infoFromApi =  await api.get(`/animais/${id}`, {
            headers: {Authorization: `Bearer ${token}`}
          })
        setAnimal(infoFromApi.data)
    }

    useEffect(() => {

        infoAnimal(id)
    
      }, [])


    return(
        <main>
            <div className={styles.container}>
                <img src={animal.Picture || "https://img.freepik.com/vetores-premium/nenhuma-foto-disponivel-icone-vetorial-simbolo-de-imagem-padrao-imagem-em-breve-para-site-ou-aplicativo-movel_87543-10615.jpg"} alt="foto do pet" />
                <div className={styles.sobre}>
                    <h1>{animal.nome}</h1>  
                    
                    <p className={styles.loc}><FaLocationDot/>Santos, SP</p>
                    
                    <p>{animal.descricao}</p>
                    <h2>Informações do pet</h2>
                    <div className={styles.infos}>
                        <p>Raca: {animal.raca}</p>
                        <p>Data de nascimento: {animal.datanasc}</p>
                        <p>Sexo:{animal.sexo}</p>
                        <p>Vacinado:{animal.vacinado}</p>
                        <p>Castrado:{animal.castrado}</p>
                        <p>Vermifugado:{animal.vermifugado}</p>
                        <h2>ID do dono:{animal.idDono}</h2>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default PerfilPet
