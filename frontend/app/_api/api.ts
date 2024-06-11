import axios from 'axios'
import { getInjectedStore } from '@/store/injector'
import { UserType, updateUser } from '@/store/slices/user'
import isTokenExpired from '@/helpers/isTokenExpired'

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

    // Add tokens to request headers
    const accessToken = localStorage.getItem('access_token')
    const refreshToken = localStorage.getItem('refresh_token')
    if (accessToken && accessToken !== 'null' && accessToken !== 'undefined') {
      if (!isTokenExpired(accessToken)) {
        console.log('# Access token is not expired.')
        req.headers['Authorization'] = `Bearer ${accessToken}`
      } else {
        console.log('# Access token is expired.')
      }
    } else if (
      refreshToken &&
      refreshToken !== 'null' &&
      refreshToken !== 'undefined'
    ) {
      if (!isTokenExpired(refreshToken)) {
        console.log('# Refresh token is not expired.')
        req.headers['Authorization'] = `Bearer ${refreshToken}`
      } else {
        console.log('# Refresh token is expired.')
      }
    } else {
      console.log('# No tokens found in local storage.')
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
