<template>
  <div>
    <h1 class="title">Agent domains</h1>
    <b-button
      type="is-primary"
      :outlined="domains.length > 0"
      icon-right="plus"
      @click="clickNewDomain"
    >Create new domain</b-button>
    <section class="domains-list">
      <b-table
        :data="domains"
        :striped="true"
        :loading="isLoading"
        :focusable="true"
        :mobile-cards="true"
        default-sort="name"
      >
        <template slot-scope="props">
          <b-table-column field="name" label="Name" sortable class="is-capitalized">
              {{ props.row.name }}
          </b-table-column>

          <b-table-column field="language" label="Language" sortable>
              {{ props.row.language }}
          </b-table-column>

          <b-table-column label="Actions" width="150" numeric>
              <b-button type="is-primary" aria-label="edit" @click="clickEdit(props.row)"><b-icon icon="pencil"></b-icon></b-button>
              <b-button type="is-danger" aria-label="delete" @click="clickDelete(props.row)"><b-icon icon="delete"></b-icon></b-button>
          </b-table-column>
        </template>
        <template slot="empty">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>
                <b-icon icon="emoticon-sad" size="is-large"></b-icon>
              </p>
              <p>There's no domains yet. Start by creating one.</p>
            </div>
          </section>
        </template>
      </b-table>
    </section>
    <dialog-base
      title="New domain"
      :error-message="errorMessage"
      :open="openNewDomainModal"
      @close="onCloseDialog"
    >
      <new-domain-form @form-change="onFormChange" :initialData="this.initialDomainData"/>
      <div class="level">
        <b-button
          @click="clickSubmitDomain"
          type="is-primary"
          :disabled="!isValidForm"
        >
          {{editDomainId ? 'Update' : 'Create'}}
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
      isLoading: true,
      errorMessage: '',
      domainData: {},
      initialDomainData: {},
      editDomainId: '',
    }
  },
  created() {
    this.loadDomains()
  },
  methods: {
    loadDomains() {
      this.isLoading = true
      this.apiGetDomains(this.agentId)
        .then(result => this.domains = result || [])
        .finally(() => this.isLoading = false)
    },
    clickNewDomain() {
      this.openNewDomainModal = true
    },
    clickSubmitDomain() {
      const promise = this.editDomainId
        ? this.apiPutDomain(this.agentId, {...this.domainData, domainId: this.editDomainId})
        : this.apiPostDomain(this.agentId, this.domainData)
      promise.then((newDomain) => {
        if (this.editDomainId) {
          const editedDomainIndex = this.domains.findIndex(domain => domain._id === this.editDomainId)
          this.domains.splice(editedDomainIndex, 1, newDomain)
        } else {
          this.domains.push(newDomain)
        }
        this.onCloseDialog()
      })
      .catch(error => {
        this.errorMessage = error
      })
    },
    clickEdit(domain) {
      this.initialDomainData = domain
      this.editDomainId = domain._id
      this.openNewDomainModal = true
    },
    clickDelete(domain) {
      this.$buefy.dialog.confirm({
        title: 'Please confirm',
        message: `You are going to delete domain "${domain.name}"`,
        onConfirm: () => {
          this.apiDeleteDomain(this.agentId, {domainId: domain._id})
            .catch(error => this.$buefy.notification.open({
              duration: 2000,
              message: error,
              position: 'is-bottom-right',
              type: 'is-danger',
              hasIcon: true
            }))
            .finally(() => this.loadDomains())
        }
      })
    },
    onFormChange ({valid, data}) {
      this.errorMessage = ''
      this.isValidForm = valid
      if (valid) {
        this.domainData = data
      }
    },
    onCloseDialog() {
      this.openNewDomainModal = false
      this.domainData = {}
      this.initialDomainData = {}
      this.editDomainId = ''
    }
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
td .button:not(:last-child) {
  margin-right: 1rem;
}
</style>