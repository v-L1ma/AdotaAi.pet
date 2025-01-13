import { useForm } from "react-hook-form"
import styles from './Cadastro.module.css'
import api from '../../sevices/api'
import {yupResolver} from '@hookform/resolvers/yup'
import { userValidationSchema } from "../../utils/userValidation"
import { toast } from 'react-toastify';
import { useState } from "react"

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
      alert('Usuário cadastrado com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar o usuário');
    }
  };

  return (
    <div className={styles.container}>
      
      <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} required />
      <input
          type="text"
          name="name"
          placeholder="Nome"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Telefone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          value={formData.cpf}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="birthdate"
          value={formData.birthdate}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default Cadastro;