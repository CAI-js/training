import {api, genericErrorManagement} from '../helper'
import {setToken} from '../jwt'

export default {
  methods: {
    apiLogin({email, password}) {
      return api.post('auth/local/login', {email, password})
      .then(setToken)
      .catch(error => {
        if (error.status && error.status === 404) {
          return Promise.reject('API error: User or password invalid')
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