import {isTokenExpired, getTokenInfo, getToken, getRefreshToken, setToken} from './jwt'

const DOMAIN = 'http://localhost:4891/'

async function getHeaders() {
  const baseHeaders = {'Content-Type': 'application/json'}
  if (isTokenExpired()) {
    const email = getTokenInfo().email
    const refreshToken = getRefreshToken()
    await doCall('auth/local/refresh', {
        mode: 'cors',
        method: 'POST',
        headers: baseHeaders,
        body: JSON.stringify({email, refreshToken})
      })
      .then(setToken)
      .catch(() => {
        window.location.href="/#/login"
      })
  }
  const token = getToken()
  if (token) {
    baseHeaders['Authorization'] = `Bearer ${token}`
  }
  return Promise.resolve(baseHeaders)
}

async function doCall(url, fetchOptions) {
  const path = `${DOMAIN}api/${url}`
  try {
    const result = await fetch(path, fetchOptions)
    if (result.ok) {
      return Promise.resolve(result.json())
    } else {
      return Promise.reject(result)
    }
  } catch (error) {
    console.log('MSG: doCall -> error', error)
    return Promise.reject(new Error('Network error: check your connection and try again'))
  }
}
async function apiGet (url) {
  const headers = await getHeaders()
  return doCall(url, {
    mode: 'cors',
    headers,
  })
}
async function apiPost (url, data) {
  const headers = await getHeaders()
  return doCall(url, {
    method: 'POST',
    mode: 'cors',
    headers,
    body: JSON.stringify(data)
  })
}
const api = {
  get: apiGet,
  post: apiPost,
}

function genericErrorManagement(error) {
  if (error.message) {
    return Promise.reject(error.message)
  } else {
    return Promise.reject('API error: Unknown reason')
  }
}

export {api, genericErrorManagement}