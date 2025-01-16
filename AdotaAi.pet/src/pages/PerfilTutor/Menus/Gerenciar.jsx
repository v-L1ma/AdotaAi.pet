import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../context/AuthContext";
import api from "../../../sevices/api";
import CardPet from "../../../components/CardPet";

function Gerenciar() {
  const { userInfo } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [animais, setAnimais] = useState([]);

  console.log(userInfo.id)

  // Função para listar animais cadastrados
  async function listaAnimais(id) {
    try {
      const response = await api.get("/animais-cadastrados", {
        params: { id: id }, // Certifique-se de que o backend espera "ownerId"
        headers: { Authorization: `Bearer ${token}` },
      });

      setAnimais(response.data); // Atualiza o estado com os animais retornados
    } catch (error) {
      console.error("Erro ao buscar animais cadastrados:", error);
    }
  }

  // useEffect para carregar os dados ao montar o componente
  useEffect(() => {
    if (userInfo?.id) {
      listaAnimais(userInfo.id);
    }
  }, [userInfo]);

  return (
    <div>
      <h1>Gerenciar Animais</h1>
      {animais.length > 0 ? (
        animais.map((animal) => (
          <CardPet animais={animal} key={animal.id} />
        ))
      ) : (
        <p>Nenhum animal cadastrado.</p>
      )}
    </div>
  );
}

export default Gerenciar;