import axios from 'axios'
import { getInjectedStore } from '@/store/injector'
import { UserType, updateUser } from '@/store/slices/user'

// API INSTANCE
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// INTERCEPTORS
// On request
api.interceptors.request.use(
  (req) => {
    // Ensures '/' is added at the end of URLs to prevent 404 errors
    if (req.url && req.url[req.url.length - 1] !== '/') {
      req.url += '/'
    }

    // Add access token to header if it exists
    const access_token = localStorage.getItem('access_token')
    if (access_token !== 'null' && access_token !== 'undefined') {
      req.headers.access_token = localStorage.getItem('access_token')
    }

    console.log('# Intercepted request:', req)
    return req
  },
  (error) => {
    return Promise.reject(error)
  },
)

// On response
api.interceptors.response.use(
  (res) => {
    // Add tokens to local storage
    localStorage.setItem('access_token', res.data?.access)
    localStorage.setItem('refresh_token', res.data?.refresh)
    const user: UserType = res.data
    const store = getInjectedStore()
    store?.dispatch(updateUser(user))

    console.log('# Intercepted response:', res)
    return res
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api
