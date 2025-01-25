import { useForm } from "react-hook-form"
import styles from './Cadastro.module.css'
import api from '../../sevices/api'
import {yupResolver} from '@hookform/resolvers/yup'
import { userValidationSchema } from "../../utils/userValidation"
import { toast } from 'react-toastify';
import { useState } from "react"
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

function Cadastro() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    cpf: '',
    birthdate: '',
    phone: '',
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
      formDataToSend.append('file', file); // Adiciona o arquivo ao FormData

      // Adiciona os outros campos ao FormData
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      // Faz o POST para a rota /cadastro
      const response = await api.post('http://localhost:3000/cadastro', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      toast.success('Usuário cadastrado com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao cadastrar o usuário');
    }
  };

  return (
    <div className={styles.container}>

      <h1>Cadastre-se</h1>
      
      <form onSubmit={handleSubmit}>       

      <div className={styles.containerFoto}>
        <label htmlFor="foto" className={styles.icone}>
        <MdOutlineAddPhotoAlternate/>
        </label>
        <label htmlFor="foto" className={styles.foto_label}>Escolha uma foto</label>
        <input className={styles.foto} id="foto" type="file" onChange={handleFileChange} required />
      </div>

      <label htmlFor="name">Nome</label>
      <input
          type="text"
          name="name"
          id="name"
          placeholder="Nome"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="seuemail@hotmail.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label htmlFor="phone">Telefone</label>
        <input
          type="text"
          name="phone"
          id="phone"
          placeholder="(XX) XXXXX-XXXX"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label htmlFor="cpf">CPF</label>
        <input
          type="text"
          name="cpf"
          id="cpf"
          placeholder="CPF"
          value={formData.cpf}
          onChange={handleChange}
          required
        />
        <label htmlFor="birthdate">Data de nascimento</label>
        <input
          type="date"
          name="birthdate"
          id="birthdate"
          value={formData.birthdate}
          onChange={handleChange}
          required
        />
        <label htmlFor="password">Senha</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button className={styles.enviar} type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default Cadastro;