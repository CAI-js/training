import {api, genericErrorManagement} from '../helper'

export default {
  methods: {
    apiGetAgents() {
      return api.get('agents/')
      .catch(error => {
        if (error.status && error.status === 401) {
          return Promise.reject('API error: User not logged in')
        } else {
          return genericErrorManagement(error)
        }
      })
    },
    apiGetAgent(id) {
      return api.get(`agents/${id}`)
      .catch(error => {
        if (error.status && error.status === 401) {
          return Promise.reject('API error: User not logged in')
        } else {
          return genericErrorManagement(error)
        }
      })
    },
    apiPostAgent({ name, description, readers, writers }) {
      return api.post('agents/', { name, description, readers, writers })
        .catch(error => {
          if (error.status) {
            switch (error.status) {
              case 400:
                return Promise.reject('API error: Agent name is mandatory')
              case 401:
                return Promise.reject('API error: User not logged in')
              case 409:
                return Promise.reject('API error: Agent with the same tag already exists')
              default:
                return genericErrorManagement(error)
                break;
            }
          } else {
            return genericErrorManagement(error)
          }
        })
    },
  }
}