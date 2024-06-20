import axios, { AxiosRequestConfig } from 'axios'
import { isTokenExpired } from '@/helpers'

// API INSTANCE
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

function setAuthorizationHeader(
  token: string | null,
  tokenType: 'access' | 'refresh',
  req: AxiosRequestConfig,
) {
  if (token && token !== 'null' && token !== 'undefined') {
    if (!isTokenExpired(token)) {
      console.log(`# ${tokenType} token is not expired.`)
      req.headers = {
        ...req.headers,
        authorization: `Bearer ${token}`,
      }
      return true
    } else {
      localStorage.removeItem(`${tokenType}_token`)
    }
  }
  return false
}

// INTERCEPTORS
// On request
api.interceptors.request.use(
  (req) => {
    // Ensures '/' is added at the end of URLs to prevent 404 errors
    if (req.url && req.url[req.url.length - 1] !== '/') {
      req.url += '/'
    }
    if (req.requiresAuth) {
      /*
        If a token is found in local storage, we add it to the header
        otherwise, we reject the request.
      */
      const accessToken = localStorage.getItem('access_token')
      const refreshToken = localStorage.getItem('refresh_token')
      if (!setAuthorizationHeader(accessToken, 'access', req)) {
        if (!setAuthorizationHeader(refreshToken, 'refresh', req)) {
          return Promise.reject(
            `${req.url} : No valid token found in local storage, aborting request.`,
          )
        }
      }
    }

    console.log('# Intercepted request:', req)
    return req
  },
  (error) => {
    console.error('# error :', error)
    return Promise.reject(error)
  },
)

// On response
api.interceptors.response.use(
  (res) => {
    // Add tokens to local storage if they are in the response
    if (res.data?.access || res.data?.refresh) {
      localStorage.setItem('access_token', res.data?.access)
      localStorage.setItem('refresh_token', res.data?.refresh)
    }
    if (res.data?.token) {
      localStorage.setItem('access_token', res.data?.token)
    }
    if (res.headers['authorization']?.includes('Bearer')) {
      localStorage.setItem(
        'access_token',
        res.headers['authorization'].split(' ')[1],
      )
    }

    console.log('# Intercepted response:', res)
    return res
  },
  (error) => {
    console.error('# Intercepted error :', error)
    return Promise.reject(error)
  },
)

export default api
