import axios from 'axios'

const instance = axios.create({
    baseURL: `http://${process.env.PORT}`,
    timeout: 1000,
    headers: {}
})
export default instance