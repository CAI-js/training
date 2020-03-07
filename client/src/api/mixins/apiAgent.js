import {api, genericErrorManagement} from '../helper'

export default {
  methods: {
    apiGetAgents() {
      return api.get('agents/')
      .then(data => {

      })
      .catch(error => {
        if (error.status && error.status === 401) {
          return Promise.reject('API error: User not logged in')
        } else {
          genericErrorManagement(error)
        }
      })
    },
  }
}