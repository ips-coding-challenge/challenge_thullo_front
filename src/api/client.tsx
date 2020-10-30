import axios from 'axios'

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}
const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api/',
  headers,
})

client.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token')

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },

  (error) => {
    return Promise.reject(error)
  }
)

export default client
