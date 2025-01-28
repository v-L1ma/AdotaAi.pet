import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../../context/AuthContext";
import api from "../../../../sevices/api";
import CardPet from "../../../../components/CardPet/CardPet";
import styles from './Gerenciar.module.css'
import Loader from '../../../../components/Loader/Loader'

function Gerenciar() {
  const { userInfo } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [animais, setAnimais] = useState([]);
  const [isLoading, SetIsLoading] = useState(true)

  console.log(userInfo.id)

  async function listaAnimais(id) {
    try {
      const response = await api.get("/animais-cadastrados", {
        params: { id: id }, 
        headers: { Authorization: `Bearer ${token}` },
      });

      setAnimais(response.data); 
      SetIsLoading(false)
    } catch (error) {
      console.error("Erro ao buscar animais cadastrados:", error);
    }
  }

  useEffect(() => {
    if (userInfo?.id) {
      listaAnimais(userInfo.id);
    }
  }, [userInfo]);

  return (
    <div>
      <h1>Gerenciar Animais</h1>

      <div className={styles.galery}>
        {
          isLoading ?
          <Loader/>
          :
          animais.length > 0 ? (
            animais.map((animal) => (
              <CardPet animais={animal} key={animal.id} />
            ))
          ) : (
            <p>Nenhum animal cadastrado.</p>
          )
        }
      </div>

    </div>
  );
}

export default Gerenciar;