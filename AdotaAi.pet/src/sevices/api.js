import axios from 'axios'

const api = axios.create({
    baseURL: 'backend-adotaaipet-production.up.railway.app'
})

export default api