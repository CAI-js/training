<template>
  <div>
    <h1 class="title">Agent intents</h1>
      <div class="first-line">
        <domain-selector :domains="domains" :selectedDomainId="selectedDomainId" @select-domain="onSelectDomainId"/>
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
      <new-intent-form @form-change="onFormChange" :initialData="this.initialIntentData" :domains="domains"/>
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
import DomainSelector from '@/components/micro/DomainSelector'

export default {
  name: 'Intents',
  mixins: [apiIntents, apiDomains],
  components: {
    'new-intent-form': () => import(/* webpackChunkName: "extras" */'@/components/NewIntentForm'),
    'dialog-base': () => import(/* webpackChunkName: "extras" */'@/components/micro/DialogBase'),
    'domain-selector': DomainSelector
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
      this.initialIntentData = {
        domain: this.domains.find(domain => domain._id === this.selectedDomainId)
      }
      this.openNewIntentModal = true
    },
    clickSubmitIntent() {
      // const promise = this.editDomainId
      //   ? this.apiPutDomain(this.agentId, {...this.domainData, domainId: this.editDomainId})
      //   : this.apiPostDomain(this.agentId, this.domainData)
      this.apiPostIntent(this.agentId, {
        ...this.intentData,
        domainId: this.intentData.domain._id
      })
      .then((newIntent) => {
        // if (this.editDomainId) {
        //   const editedDomainIndex = this.intents.findIndex(domain => domain._id === this.editDomainId)
        //   this.intents.splice(editedDomainIndex, 1, newIntent)
        // } else {
          this.intents.push(newIntent)
        // }
        this.onCloseDialog()
      })
      .catch(error => {
        this.errorMessage = error
      })
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
    },
    onSelectDomainId(eventData) {
      this.selectedDomainId = eventData
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
.level {
  margin-top: 2rem;
}
</style>