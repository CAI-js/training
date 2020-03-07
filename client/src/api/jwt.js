import {lsGet, lsSet} from '@/localStorage'
function isTokenExpired() {
  const tokenInfo = getTokenInfo()
  if (!tokenInfo) {
    return true
  }
  const expires = getTokenInfo().exp + 1000
  if (expires && expires - Date.now() >= 60 * 1000) {
    return false
  }
  return true
}

function getTokenInfo() {
  const token = getToken()
  if (!token) return {}
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

function getToken() {
  return lsGet('access_token')
}

function getRefreshToken() {
  return lsGet('refresh_token')
}

function setToken(data) {
  ['access_token', 'refresh_token'].forEach(name => {
    lsSet(name, data[name])
  })
}

export {isTokenExpired, getTokenInfo, getToken, getRefreshToken, setToken}