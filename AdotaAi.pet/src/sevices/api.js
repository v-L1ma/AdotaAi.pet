import axios from 'axios'

const api = axios.create({
    baseURL: 'https://backend-adota-ai-pet.vercel.app'
})

export default api