import axios from 'axios'

export const dataInstance = axios.create({
  baseURL: 'http://172.16.53.16:8084/api/v1/lendo-admin',
})

export const dataInstance2 = axios.create({
  baseURL: 'http://172.16.55.252:7000/api/v1/lendo',
})
