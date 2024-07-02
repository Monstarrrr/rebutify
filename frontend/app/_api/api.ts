import axios from 'axios'
import { isTokenExpired } from '@/helpers'
import { refreshTheToken } from '@/api/auth/refreshTheToken'

// API INSTANCE
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

let refreshTokenPromise // used to queue up requests

// INTERCEPTORS
// On request
api.interceptors.request.use(
  async (req) => {
    // Ensures '/' is added at the end of URLs to prevent 404 errors
    if (req.url && req.url[req.url.length - 1] !== '/') {
      req.url += '/'
    }
    if (req.requiresAuth) {
      // temp
      const accessToken = localStorage.getItem('access_token')
      const refreshToken = localStorage.getItem('refresh_token')
      if (
        accessToken &&
        accessToken !== 'null' &&
        accessToken !== 'undefined' &&
        !isTokenExpired(accessToken)
      ) {
        console.log(`# accessToken is not expired.`)
        req.headers['authorization'] = `Bearer ${accessToken}`
        return req
      }
      console.log(`# accessToken is expired.`)
      localStorage.removeItem(`access_token`)
      if (
        !refreshToken ||
        refreshToken === 'null' ||
        refreshToken === 'undefined'
      ) {
        console.log(`# No valid refresh token found.`)
        return req
      }
      // Check for in-flight refresh requests and start one if required
      refreshTokenPromise ??= refreshTheToken(refreshToken)
      const newAccessToken = await refreshTokenPromise
      refreshTokenPromise = null // clean in-flight state
      localStorage.setItem('access_token', newAccessToken)
      req.headers['authorization'] = `Bearer ${newAccessToken}`
    }

    console.log('# Intercepted request:', req)
    return req
  },
  (error) => {
    console.error(
      '# request error :',
      error?.reponse?.data?.detail ??
        error?.response?.data ??
        error?.response ??
        error,
    )
    return Promise.reject(error)
  },
)

// On response
api.interceptors.response.use(
  (res) => {
    // Add tokens to local storage if they are in the response
    res.data?.access && localStorage.setItem('access_token', res.data?.access)
    res.data?.refresh && localStorage.setItem('refresh_token', res.data?.refresh)
    res.data?.token && localStorage.setItem('access_token', res.data?.token)
    if (res.headers['authorization']?.includes('Bearer')) {
      localStorage.setItem(
        'access_token',
        res.headers['authorization'].split(' ')[1],
      )
    }

    console.log('# Intercepted response:', res)
    return res
  },
  (error: any) => {
    console.error(
      '# response error :',
      error?.reponse?.data?.detail ??
        error?.response?.data ??
        error?.response ??
        error,
    )
    return Promise.reject(error)
  },
)
export default api
