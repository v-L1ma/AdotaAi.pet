import { useEffect, useState } from 'react';
import styles from './PerfilPet.module.css'
import { FaLocationDot } from "react-icons/fa6";
import api from "../../sevices/api"
import { useParams } from 'react-router-dom';

function PerfilPet(){

    const { id } = useParams()
    const [animal, setAnimal] = useState([])
   

    async function infoAnimal(id){
        const infoFromApi = await api.get(`/animais/${id}`)
        setAnimal(infoFromApi.data)
    }

    useEffect(() => {

        infoAnimal(id)
    
      }, [])

    return(
        <main>
            <div className={styles.container}>
                <img src={animal.foto} alt="foto do pet" />
                <div className={styles.sobre}>
                    <h1>{animal.nome}</h1>  
                    <p className={styles.loc}><FaLocationDot/>Santos, SP</p>
                    
                    <p>{animal.descricao}</p>
                    <h2>Informações do pet</h2>
                    <div className={styles.infos}>
                        <p>Raca: {animal.raca}</p>
                        <p>Idade:{animal.datanasc}</p>
                        <p>Sexo:{animal.sexo}</p>
                        <p>Vacinado:{animal.vacinado}</p>
                        <p>Castrado:{animal.castrado}</p>
                        <p>Vermifugado:{animal.vermifugado}</p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default PerfilPet
