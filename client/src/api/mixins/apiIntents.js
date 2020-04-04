import {api, genericErrorManagement} from '../helper'

export default {
  methods: {
    apiGetIntents(agentId, domainId) {
      const url = `agents/${agentId}/`
      if (domainId) url.concat(`domains/${domainId}/`)
      url.concat('intents')
      return api.get(url)
        .catch(error => {
          if (error.status && error.status === 401) {
            return Promise.reject('API error: User not logged in')
          } else {
            return genericErrorManagement(error)
          }
        })
    },
  }
}