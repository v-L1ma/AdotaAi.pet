import * as Yup from 'yup'

export const userValidationSchema = Yup.object().shape({
    fullname: Yup.string().required('Nome completo é obrigatório.'),

    cpf: Yup.string('Não é permitido letras nesse campo.').required('O CPF é obrigatório.'),

    birthdate: Yup.string().required('Por favor, insira sua data de nascimento.'),

    phone: Yup.string().required('Por favor, insira um numero de telefone.'),

    email: Yup.string().email('Por favor insira um email válido.').required('Por favor, insira um endereço de email'),

    password: Yup.string().min(6, 'No minimo, 6 caracteres.').required('Por favor, insira uma senha.'),

    confirmpassword: Yup.string().oneOf([Yup.ref('password'), null], 'As senhas não coincidem.').required('Por favor, insira uma senha.'),

    passwordForLogin: Yup.string().required('Por favor, insira uma senha'),
})