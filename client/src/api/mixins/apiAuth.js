import {api, genericErrorManagement} from '../helper'
import {lsSet} from '../localStorage'

export default {
  methods: {
    apiLogin({email, password}) {
      return api.post('auth/local/login', {email, password})
      .then(data => {
        ['access_token', 'refresh_token', 'expires'].forEach(name => {
          lsSet(name, data[name])
        })
      })
      .catch(error => {
        if (error.status && error.status === 404) {
          return Promise.reject('API error: User or password invalid')
        } else {
          genericErrorManagement(error)
        }
      })
    },
    apiRefresh({email, refreshToken}) {
      return api.post('auth/local/refresh', {email, refreshToken})
      .catch(error => {
        if (error.status && error.status === 401) {
          return Promise.reject('API error: Invalid user token')
        } else {
          genericErrorManagement(error)
        }
      })
    },
    apiRegister({email, password, name}) {
      return api.post('auth/local/register', {email, password, name})
        .catch(error => {
          if (error.status && error.status === 409) {
            return Promise.reject('API error: User already exists')
          } else {
            genericErrorManagement(error)
          }
        })
    },
  }
}