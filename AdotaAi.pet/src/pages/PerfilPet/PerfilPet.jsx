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

      function calcularIdade(dataNascimento) {
        // Obtém a data atual
        const dataAtual = new Date();
    
        // Converte a data de nascimento para um objeto Date (formato yyyy-mm-dd)
        const dataNascimentoObj = new Date(dataNascimento);
    
        // Calcula a diferença de anos
        let idade = dataAtual.getFullYear() - dataNascimentoObj.getFullYear();
    
        // Verifica se o aniversário já passou no ano atual
        const mesAtual = dataAtual.getMonth(); // Mês atual (0 a 11)
        const diaAtual = dataAtual.getDate(); // Dia atual
        const mesNascimento = dataNascimentoObj.getMonth(); // Mês de nascimento (0 a 11)
        const diaNascimento = dataNascimentoObj.getDate(); // Dia de nascimento
    
        // Se o aniversário ainda não aconteceu neste ano, subtrai 1 da idade
        if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
            idade--;
        }
    
        return idade;
    }

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
                        <p>Idade:{calcularIdade(animal.datanasc)}</p>
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
