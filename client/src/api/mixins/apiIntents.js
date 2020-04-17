import {api, genericErrorManagement} from '../helper'

export default {
  methods: {
    apiGetIntents(agentId, domainId) {
      let url = `agents/${agentId}/`
      if (domainId) url = url.concat(`domains/${domainId}/`)
      url = url.concat('intents')
      return api.get(url)
        .catch(error => {
          if (error.status && error.status === 401) {
            return Promise.reject('API error: User not logged in')
          } else {
            return genericErrorManagement(error)
          }
        })
    },
    apiPostIntent(agentId, { name, domainId, utterances, answers }) {
      return api.post(`agents/${agentId}/intents`, { name, domainId, utterances, answers })
        .catch(error => {
          if (error.status) {
            switch (error.status) {
              case 400:
                return Promise.reject('API error: Domain id is mandatory')
              case 401:
                return Promise.reject('API error: User has no rights to modify this agent')
              case 404:
                return Promise.reject('API error: Domain not found')
              case 409:
                return Promise.reject('API error: Intent with the same name already exists in that domain')
              default:
                return genericErrorManagement(error)
            }
          } else {
            return genericErrorManagement(error)
          }
        })
    },
    apiDeleteIntent(agentId, {intentId}) {
      return api.delete(`agents/${agentId}/intents/${intentId}`)
        .catch(error => {
          if (error.status && error.status === 401) {
            return Promise.reject('API error: User has no rights to modify this agent')
          } else {
            return genericErrorManagement(error)
          }
        })
    },
    apiPutIntent(agentId, { name, domainId, utterances, answers, intentId }) {
      return api.put(`agents/${agentId}/intents/${intentId}`, {name, domainId, utterances, answers})
        .catch(error => {
          switch (error.status) {
            case 400:
              return Promise.reject('API error: Intent id is mandatory')
            case 401:
              return Promise.reject('API error: User has no rights to modify this agent')
            case 404:
              return Promise.reject('API error: Intent not found')
            default:
              return genericErrorManagement(error)
          }
        })
    }
  }
}