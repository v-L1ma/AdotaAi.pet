import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import styles from "./Doar.module.css";
import { FaCamera } from "react-icons/fa";
import api from "../sevices/api";
import { toast } from 'react-toastify'

function Doar() {
  const inputNome = useRef();
  const inputRaca = useRef();
  const inputFoto = useRef();
  const inputDataNasc = useRef();
  const inputSexo = useRef();
  const selectVacinado = useRef();
  const selectCastrado = useRef();
  const selectVermifugado = useRef();
  const inputDesc = useRef();
  const navigate = useNavigate();


  const token = localStorage.getItem("token");

  const validarFormulario = () => {
    if (
      inputNome.current.value === "" ||
      inputRaca.current.value === "" ||
      inputFoto.current.value === "" ||
      inputDataNasc.current.value === "" ||
      inputSexo.current.value === "" ||
      selectVacinado.current.value === "" ||
      selectCastrado.current.value === "" ||
      selectVermifugado.current.value === "" ||
      inputDesc.current.value === ""
    ) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return false;
    }
    return true;
  };

  async function cadastrarAnimais(e) {
    e.preventDefault()

    if(validarFormulario()==false){
      return;
    }

    try{      
      await api.post("/animais", {
      nome: inputNome.current.value,
      raca: inputRaca.current.value,
      foto: inputFoto.current.value,
      datanasc: inputDataNasc.current.value,
      sexo: inputSexo.current.value,
      vacinado: selectVacinado.current.value,
      castrado: selectCastrado.current.value,
      vermifugado: selectVermifugado.current.value,
      descricao: inputDesc.current.value,
    });

    toast.success('Animal cadatrado')
    navigate('/')
  
  } catch(e){
    console.log(console.e)
    toast.error('Erro ao cadastrar o animal.')
  }
  }

  return (
    <main>
      <div className={styles.disponiveis}>
        {token 
        ? <div>
            <h1>Primeiro passo para o novo lar</h1>
            <div className={styles.conteudo}>
              <form className={styles.cadastro}>
                <div className={styles.inserir_foto}>
                  <FaCamera className={styles.icone} />
                  <label htmlFor="foto">Escolha uma foto</label>
                  <input
                    type="text"
                    name="foto"
                    id="foto"
                    placeholder="Insira o URL da imagem"
                    ref={inputFoto}
                    
                  />
                </div>
                <div className={styles.nome}>
                  <p>Nome</p>
                  <input
                    placeholder="Insira o nome do animal"
                    type="text"
                    name="nomePet"
                    id="nomePet"
                    ref={inputNome}
                    required
                  />
                </div>
                <div className={styles.raca}>
                  <p>Raça</p>
                  <select id="raças" name="raças" ref={inputRaca} required>
                    <option disabled defaultValue>
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
                    <option value="labrador-retriever">Labrador Retriever</option>
                    <option value="lhasa-apso">Lhasa Apso</option>
                    <option value="malamute-do-alasca">Malamute do Alasca</option>
                    <option value="mastiff-ingles">Mastiff Inglês</option>
                    <option value="mastim-napolitano">Mastim Napolitano</option>
                    <option value="pastor-alemao">Pastor Alemão</option>
                    <option value="pastor-australiano">Pastor Australiano</option>
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
                    <option value="yorkshire-terrier">Yorkshire Terrier</option>
                  </select>
                </div>
                <div className={styles.nasc}>
                  <p>Data de nascimento</p>
                  <input type="date" name="nasc" id="nasc" ref={inputDataNasc} required />
                </div>
                <div className={styles.sexo}>
                  <p>Sexo:</p>
                  <select name="" id="" ref={inputSexo} required>
                    <option disabled>Escolha o sexo</option>
                    <option value="Macho">Macho</option>
                    <option value="Femea">Fêmea</option>
                  </select>
                </div>
                <div className={styles.perguntas}>
                  <div>
                    <label htmlFor="vacinado">Vacinado?</label>
                    <select name="" id="" ref={selectVacinado} required>
                      <option value="Sim">Sim</option>
                      <option value="Nao">Não</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="castrado">Castrado?</label>
                    <select name="" id="" ref={selectCastrado} required>
                      <option value="Sim">Sim</option>
                      <option value="Nao">Não</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="vermifugado">vermifugado?</label>
                    <select name="" id="" ref={selectVermifugado} required>
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
                    id="descricao"
                    required
                    ref={inputDesc}
                  ></textarea>
                </div>
                <button type="submit" onClick={cadastrarAnimais} className={styles.save}>
                  Salvar & Continuar
                </button>
              </form>
              
            </div>
        </div>
        :
        <div className={styles.aviso}>
            <img src="https://img.freepik.com/vetores-gratis/ilustracao-do-conceito-de-login_114360-4525.jpg?t=st=1735249208~exp=1735252808~hmac=9cef5a27757934c97f24723536096b7446ed73cf54fdae66da38559815d4fd1f&w=826" alt="" />
            <p>Para cadastrar um animal para adoção é necessário realizar o login!</p>
        </div>
        }

        
      </div>
    </main>
  );
}

export default Doar;
