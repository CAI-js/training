<template>
  <div>
    <h1 class="title">Agent domains</h1>
    <b-button type="is-primary" :outlined="domains.length > 0" icon-right="plus" @click="clickNewDomain">Create new domain</b-button>
    <section class="domains-list">
      <p v-for="domain in domains" :key="domain.id">{{domain.name}} - {{domain.language}}</p>
    </section>
    <dialog-base
      title="New domain"
      :error-message="errorMessage"
      :open="openNewDomainModal"
      @close="openNewDomainModal = false"
    >
          <new-domain-form @form-change="onFormChange"/>
          <div class="level">
            <b-button
              @click="clickSubmitDomain"
              type="is-primary"
              :disabled="!isValidForm"
            >
              Create
            </b-button>
          </div>
    </dialog-base>
  </div>
</template>
<script>
import apiDomains from '@/api/mixins/apiDomains'
export default {
  name: 'Domains',
  mixins: [apiDomains],
    components: {
    'new-domain-form': () => import(/* webpackChunkName: "extras" */'@/components/NewDomainForm'),
    'dialog-base': () => import(/* webpackChunkName: "extras" */'@/components/micro/DialogBase'),
  },
  data() {
    return {
      domains: [],
      agentId: this.$route.params.id,
      openNewDomainModal: false,
      isValidForm: false,
      errorMessage: '',
      domainData: {}
    }
  },
  created() {
    this.apiGetDomains(this.agentId).then(result => this.domains = result || [])
  },
  methods: {
    clickNewDomain() {
      this.openNewDomainModal = true
    },
    clickSubmitDomain() {
      this.apiPostDomain(this.agentId, this.domainData)
        .then((newDomain) => {
          this.domains.push(newDomain)
          this.openNewDomainModal = false
          this.domainData = {}
        })
        .catch(error => {
          this.errorMessage = error
        })
    },
    onFormChange ({valid, data}) {
      this.errorMessage = ''
      this.isValidForm = valid
      if (valid) {
        this.domainData = data
      }
    },
  }
}
</script>
<style scoped>
.domains-list {
  margin-top: 2rem;
}
.level {
  margin-top: 2rem;
}
</style>