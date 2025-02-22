import axios from 'axios'
import { isTokenExpired } from '@/helpers'
import { refreshTheToken } from '@/api/auth/refreshTheToken'
import { removeUser } from '@/store/slices/user'

// API INSTANCE
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

let refreshTokenPromise // used to queue up requests

// # INJECT STORE TO PREVENT IMPORT ISSUES #
let store: any
export const injectStore = (_store: any) => {
  store = _store
}

// INTERCEPTORS
// On request
api.interceptors.request.use(
  async (req) => {
    // Ensures '/' is added at the end of URLs to prevent 404 errors
    if (req.url && req.url[req.url.length - 1] !== '/') {
      req.url += '/'
    }
    if (req.withAuth) {
      const accessToken = localStorage.getItem('access_token')
      const refreshToken = localStorage.getItem('refresh_token')

      if (
        accessToken &&
        accessToken !== 'null' &&
        accessToken !== 'undefined' &&
        !isTokenExpired(accessToken)
      ) {
        console.log(`ℹ️ accessToken is not expired.`)
        req.headers['authorization'] = `Bearer ${accessToken}`
        console.log(`↗ [${req.url}] request:`, req)
        return req
      }
      console.log(`ℹ️ accessToken is expired.`)
      localStorage.removeItem(`access_token`)
      if (
        !refreshToken ||
        refreshToken === 'null' ||
        refreshToken === 'undefined'
      ) {
        console.log(`ℹ️ No valid refresh token found.`)
        store.dispatch(removeUser())
        return req
      }
      // If there is a valid refresh token, we try using it.
      // Check for in-flight refresh requests and start one if required.
      try {
        refreshTokenPromise ??= refreshTheToken(refreshToken)
        const newAccessToken = await refreshTokenPromise
        refreshTokenPromise = null // clean in-flight state
        localStorage.setItem('access_token', newAccessToken)
        req.headers['authorization'] = `Bearer ${newAccessToken}`
      } catch (error: any) {
        store.dispatch(removeUser())
        localStorage.removeItem('refresh_token')
        return req
      }
    }

    console.log(`↗ [${req.url}] request:`, req)
    return req
  },
  (error) => {
    console.error(
      '# request error :',
      error?.reponse?.data?.detail ??
        error?.response?.data ??
        error?.response ??
        error
    )
    return Promise.reject(error)
  }
)

// On response
api.interceptors.response.use(
  (res) => {
    // Add tokens to local storage if they are in the response
    res.data?.access && localStorage.setItem('access_token', res.data?.access) // old api
    res.data?.refresh && localStorage.setItem('refresh_token', res.data?.refresh) // old api
    res.data?.token && localStorage.setItem('access_token', res.data?.token) // old api
    res.data?.resources?.access &&
      localStorage.setItem('access_token', res.data?.resources?.access)
    res.data?.resources?.refresh &&
      localStorage.setItem('refresh_token', res.data?.resources?.refresh)
    res.data?.resources?.token &&
      localStorage.setItem('access_token', res.data?.resources?.token)
    if (res.headers['authorization']?.includes('Bearer')) {
      localStorage.setItem(
        'access_token',
        res.headers['authorization'].split(' ')[1]
      )
    }

    console.log(`↘ [${res.config.url}] response:`, res)
    return res
  },
  (error: any) => {
    console.error(
      '❌ response error :',
      error?.reponse?.data?.detail ??
        error?.response?.data ??
        error?.response ??
        error
    )
    return Promise.reject(error)
  }
)
export default api
