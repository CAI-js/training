import {api, genericErrorManagement} from '../helper'

export default {
  methods: {
    apiGetDomains(agentId) {
      return api.get(`agents/${agentId}/domains`)
      .catch(error => {
        if (error.status && error.status === 401) {
          return Promise.reject('API error: User not logged in')
        } else {
          genericErrorManagement(error)
        }
      })
    },
    apiPostDomain(agentId, { name, language }) {
      return api.post(`agents/${agentId}/domains`, { name, language })
        .catch(error => {
          if (error.status) {
            switch (error.status) {
              case 400:
                return Promise.reject('API error: Agent name is mandatory')
              case 401:
                return Promise.reject('API error: User has no rights to modify this bot')
              case 409:
                return Promise.reject('API error: Domain with the same name already exists')
              default:
                genericErrorManagement(error)
                break;
            }
          } else {
            genericErrorManagement(error)
          }
        })
    },
  }
}