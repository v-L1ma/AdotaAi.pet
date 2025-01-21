import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router";
import styles from "./Doar.module.css";
import { FaCamera } from "react-icons/fa";
import api from "../sevices/api";
import { toast } from "react-toastify";
import AuthContext from "../context/AuthContext";

function Doar() {
  const token = localStorage.getItem("token");
  const { userInfo, setUserInfo } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    idDono: `${userInfo.id}`,
    nome: "",
    animal: "",
    raca: "",
    sexo: "",
    vacinado: "",
    castrado: "",
    vermifugado: "",
    descricao: "",
  });

  const [file, setFile] = useState(null); // Para armazenar o arquivo

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Armazena o arquivo selecionado
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", file); // Adiciona o arquivo ao FormData

      // Adiciona os outros campos ao FormData
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      // Faz o POST para a rota /cadastro
      const response = await api.post("/animais", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      toast.success("Usuário cadastrado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar o usuário");
    }
  };

  return (
    <main>
      <div className={styles.disponiveis}>
        {token ? (
          <div>
            <h1>Primeiro passo para o novo lar</h1>
            <div className={styles.conteudo}>
              <form className={styles.cadastro} onSubmit={handleSubmit}>
                <div className={styles.inserir_foto}>
                  <FaCamera className={styles.icone} />
                  <label htmlFor="foto">Escolha uma foto</label>
                  <input type="file" onChange={handleFileChange} required />
                </div>
                <div className={styles.nome}>
                  <p>Nome</p>
                  <input
                    type="text"
                    name="nome"
                    placeholder="Nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.animal}>
                  <p>Animal</p>
                  <select 
                    name="animal"
                    value={formData.animal}
                    onChange={handleChange}
                    required
                  >
                    <option value="Cachorro">Cachorro</option>
                    <option value="Gato">Gato</option>
                  </select>
                </div>
                <div className={styles.raca}>
                  <p>Raça</p>
                  {formData.especie === "Cachorro" ? (
                    <select
                      name="raca"
                      value={formData.raca}
                      onChange={handleChange}
                      required
                    >
                      <option disabled value="">
                        -- Escolha uma raça --
                      </option>

                      <option value="Vira-lata">Vira-lata (indefinida)</option>
                      <option value="affenpinscher">Affenpinscher</option>
                      <option value="akita-inu">Akita Inu</option>
                      <option value="akita-americano">Akita Americano</option>
                      <option value="basenji">Basenji</option>
                      <option value="beagle">Beagle</option>
                      <option value="basset-hound">Basset Hound</option>
                      <option value="border-collie">Border Collie</option>
                      <option value="buldogue-frances">Buldogue Francês</option>
                      <option value="buldogue-ingles">Buldogue Inglês</option>
                      <option value="borzoi">Borzoi</option>
                      <option value="boxer">Boxer</option>
                      <option value="bull-terrier">Bull Terrier</option>
                      <option value="cane-corso">Cane Corso</option>
                      <option value="cavalier-king-charles-spaniel">
                        Cavalier King Charles Spaniel
                      </option>
                      <option value="chihuahua">Chihuahua</option>
                      <option value="chow-chow">Chow Chow</option>
                      <option value="cocker-spaniel-ingles">
                        Cocker Spaniel Inglês
                      </option>
                      <option value="cocker-spaniel-americano">
                        Cocker Spaniel Americano
                      </option>
                      <option value="dachshund">Dachshund</option>
                      <option value="dalmata">Dálmata</option>
                      <option value="doberman">Doberman</option>
                      <option value="dogo-argentino">Dogo Argentino</option>
                      <option value="golden-retriever">Golden Retriever</option>
                      <option value="husky-siberiano">Husky Siberiano</option>
                      <option value="jack-russell-terrier">
                        Jack Russell Terrier
                      </option>
                      <option value="labrador-retriever">
                        Labrador Retriever
                      </option>
                      <option value="lhasa-apso">Lhasa Apso</option>
                      <option value="malamute-do-alasca">
                        Malamute do Alasca
                      </option>
                      <option value="mastiff-ingles">Mastiff Inglês</option>
                      <option value="mastim-napolitano">
                        Mastim Napolitano
                      </option>
                      <option value="pastor-alemao">Pastor Alemão</option>
                      <option value="pastor-australiano">
                        Pastor Australiano
                      </option>
                      <option value="poodle">Poodle</option>
                      <option value="pug">Pug</option>
                      <option value="rottweiler">Rottweiler</option>
                      <option value="samoieda">Samoieda</option>
                      <option value="sao-bernardo">São Bernardo</option>
                      <option value="shar-pei">Shar Pei</option>
                      <option value="shih-tzu">Shih Tzu</option>
                      <option value="spitz-alemao">
                        Spitz Alemão (Lulu da Pomerânia)
                      </option>
                      <option value="staffordshire-bull-terrier">
                        Staffordshire Bull Terrier
                      </option>
                      <option value="weimaraner">Weimaraner</option>
                      <option value="yorkshire-terrier">
                        Yorkshire Terrier
                      </option>
                    </select>
                  ) : (
                    <select
                      name="raca"
                      value={formData.raca}
                      onChange={handleChange}
                      required
                    >
                      <option disabled value="">
                        -- Escolha uma raça --
                      </option>
                      <option value="vira-lata">
                        Vira-lata (Sem raça definida)
                      </option>
                      <option value="persa">Persa</option>
                      <option value="maine-coon">Maine Coon</option>
                      <option value="siames">Siamês</option>
                      <option value="ragdoll">Ragdoll</option>
                      <option value="bengal">Bengal</option>
                      <option value="sphynx">Sphynx (Sem pelos)</option>
                      <option value="britanico-de-pelo-curto">
                        Britânico de Pelo Curto
                      </option>
                      <option value="oriental">Oriental</option>
                      <option value="abissinio">Abissínio</option>
                      <option value="birman">Birman</option>
                      <option value="chartreux">Chartreux</option>
                      <option value="exotico-de-pelo-curto">
                        Exótico de Pelo Curto
                      </option>
                      <option value="himalaio">Himalaio</option>
                      <option value="somali">Somali</option>
                      <option value="tonquines">Tonquinês</option>
                      <option value="burmes">Burmês</option>
                      <option value="devon-rex">Devon Rex</option>
                      <option value="cornish-rex">Cornish Rex</option>
                      <option value="manx">Manx</option>
                      <option value="gato-da-floresta-norueguesa">
                        Gato da Floresta Norueguesa
                      </option>
                      <option value="americano-de-pelo-curto">
                        Americano de Pelo Curto
                      </option>
                      <option value="scottish-fold">Scottish Fold</option>
                      <option value="angora-turco">Angorá Turco</option>
                      <option value="mau-egipcio">Mau Egípcio</option>
                      <option value="toyger">Toyger</option>
                      <option value="munchkin">Munchkin</option>
                      <option value="singapura">Singapura</option>
                      <option value="nebelung">Nebelung</option>
                      <option value="balines">Balinês</option>
                      <option value="selkirk-rex">Selkirk Rex</option>
                    </select>
                  )}
                </div>
                <div className={styles.nasc}>
                  <p>Data de nascimento</p>
                  <input
                    type="date"
                    name="datanasc"
                    value={formData.datanasc}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.sexo}>
                  <p>Sexo:</p>
                  <select
                    name="sexo"
                    value={formData.sexo}
                    onChange={handleChange}
                    required
                  >
                    <option disabled value="">
                      Escolha o sexo
                    </option>
                    <option value="Macho">Macho</option>
                    <option value="Femea">Fêmea</option>
                  </select>
                </div>
                <div className={styles.perguntas}>
                  <div>
                    <label htmlFor="vacinado">Vacinado?</label>
                    <select
                      name="vacinado"
                      value={formData.vacinado}
                      onChange={handleChange}
                      required
                    >
                      <option disabled value="">
                         Selecione uma alternativa
                      </option>
                      <option value="Sim">Sim</option>
                      <option value="Nao">Não</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="castrado">Castrado?</label>
                    <select
                      name="castrado"
                      value={formData.castrado}
                      onChange={handleChange}
                      required
                    >
                      <option disabled value="">
                         Selecione uma alternativa
                      </option>
                      <option value="Sim">Sim</option>
                      <option value="Nao">Não</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="vermifugado">vermifugado?</label>
                    <select
                      name="vermifugado"
                      value={formData.vermifugado}
                      onChange={handleChange}
                      required
                    >
                      <option disabled value="">
                         Selecione uma alternativa
                      </option>
                      <option value="Sim">Sim</option>
                      <option value="Nao">Não</option>
                    </select>
                  </div>
                </div>
                <div className={styles.descricao}>
                  <label htmlFor="descricao">Breve descrição</label>
                  <br />
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className={styles.save}>
                  Salvar & Continuar
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className={styles.aviso}>
            <img
              src="https://img.freepik.com/vetores-gratis/ilustracao-do-conceito-de-login_114360-4525.jpg?t=st=1735249208~exp=1735252808~hmac=9cef5a27757934c97f24723536096b7446ed73cf54fdae66da38559815d4fd1f&w=826"
              alt=""
            />
            <p>
              Para cadastrar um animal para adoção é necessário realizar o
              login!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default Doar;
