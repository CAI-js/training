<template>
  <div>
    <h1 class="title">Agent intents</h1>
      <div class="first-line">
      <b-field class="domain-selector" v-show="domains.length > 0" aria-label="Domain selector" type="is-primary">
        <b-select v-model="selectedDomainId" expanded>
          <option value="">Select a domain</option>
          <option
              v-for="domain in domains"
              :value="domain._id"
              :key="domain._id"
              >
              {{ domain.name }}
          </option>
        </b-select>
      </b-field>
      <b-button
        type="is-primary"
        :outlined="intents.length > 0"
        icon-right="plus"
        @click="clickNewIntent"
      >Create new intent</b-button>
    </div>
    <dialog-base
      title="New intent"
      :error-message="errorMessage"
      :open="openNewIntentModal"
      @close="onCloseDialog"
    >
      <new-intent-form @form-change="onFormChange" :initialData="this.initialIntentData"/>
      <div class="level">
        <b-button
          @click="clickSubmitIntent"
          type="is-primary"
          :disabled="!isValidForm"
        >
          {{editIntentId ? 'Update' : 'Create'}}
        </b-button>
      </div>
    </dialog-base>
  </div>
</template>
<script>
import apiIntents from '@/api/mixins/apiIntents'
import apiDomains from '@/api/mixins/apiDomains'
export default {
  name: 'Intents',
  mixins: [apiIntents, apiDomains],
  components: {
    'new-intent-form': () => import(/* webpackChunkName: "extras" */'@/components/NewIntentForm'),
    'dialog-base': () => import(/* webpackChunkName: "extras" */'@/components/micro/DialogBase'),
  },
  data() {
    return {
      intents: [],
      domains: [],
      agentId: this.$route.params.id,
      selectedDomainId: '',
      openNewIntentModal: false,
      isValidForm: false,
      isLoading: true,
      errorMessage: '',
      intentData: {},
      initialIntentData: {},
      editIntentId: '',
    }
  },
  created() {
    this.isLoading = true
    Promise.all([this.loadIntents(), this.loadDomains()])
        .finally(() => this.isLoading = false)
  },
  methods: {
    loadIntents() {
      this.apiGetIntents(this.agentId)
        .then(result => this.intents = result || [])
    },
    loadDomains() {
      this.apiGetDomains(this.agentId)
        .then(result => this.domains = result || [])
    },
    clickNewIntent() {
      this.openNewIntentModal = true
    },
    clickSubmitIntent() {
      // const promise = this.editDomainId
      //   ? this.apiPutDomain(this.agentId, {...this.domainData, domainId: this.editDomainId})
      //   : this.apiPostDomain(this.agentId, this.domainData)
      // promise.then((newDomain) => {
      //   if (this.editDomainId) {
      //     const editedDomainIndex = this.domains.findIndex(domain => domain._id === this.editDomainId)
      //     this.domains.splice(editedDomainIndex, 1, newDomain)
      //   } else {
      //     this.domains.push(newDomain)
      //   }
        this.onCloseDialog()
      // })
      // .catch(error => {
      //   this.errorMessage = error
      // })
    },
    onFormChange ({valid, data}) {
      this.errorMessage = ''
      this.isValidForm = valid
      if (valid) {
        this.intentData = data
      }
    },
    onCloseDialog() {
      this.openNewIntentModal = false
      this.intentData = {}
      this.initialIntentData = {}
      this.editIntentId = ''
    }
  }
}
</script>
<style scoped>
.first-line {
  display: flex;
  grid-gap: .5rem;
}
.domain-selector {
  flex-grow: 1;
}
</style>