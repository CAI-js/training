async function apiGet (url) {
  
}
async function apiPost (url, data) {
  const path = `http://localhost:4891/api/${url}`
  try {
    const result = await fetch(path, {
      method: 'POST',
      mode: 'cors',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    if (result.ok) {
      return Promise.resolve(result.json())
    } else {
      return Promise.reject(result)
    }
  } catch (error) {
    return Promise.reject(new Error('Network error: check your connection and try again'))
  }
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