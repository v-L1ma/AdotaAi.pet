import axios from 'axios'

const api = axios.create({
    baseURL: 'https://backend-adota-ai-pet-2tv4.vercel.app'
})

export default api