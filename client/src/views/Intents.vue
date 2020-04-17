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
    <section class="intents-list">
      <b-table
        :data="intents"
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

          <b-table-column field="domain" label="Domain" sortable>
              {{ getDomainName(props.row.domainId) }}
          </b-table-column>

          <b-table-column field="utterances" label="Utterances">
              <list-viewer :content="props.row.utterances"/>
          </b-table-column>

          <b-table-column field="answers" label="Answers">
            <list-viewer :content="props.row.answers"/>
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
              <p>There's no intents yet. Start by creating one.</p>
            </div>
          </section>
        </template>
      </b-table>
    </section>
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
import ListViewer from '@/components/micro/ListViewer'

export default {
  name: 'Intents',
  mixins: [apiIntents, apiDomains],
  components: {
    'new-intent-form': () => import(/* webpackChunkName: "extras" */'@/components/NewIntentForm'),
    'dialog-base': () => import(/* webpackChunkName: "extras" */'@/components/micro/DialogBase'),
    'domain-selector': DomainSelector,
    'list-viewer': ListViewer,
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
      return this.apiGetIntents(this.agentId, this.selectedDomainId)
        .then(result => this.intents = result || [])
    },
    loadDomains() {
      return this.apiGetDomains(this.agentId)
        .then(result => this.domains = result || [])
    },
    getDomainName(domainId) {
      const domain = this.domains.find(domain => domain._id === domainId)
      return domain ? domain.name : ''
    },
    clickNewIntent() {
      this.initialIntentData = {
        domainId: this.selectedDomainId
      }
      this.openNewIntentModal = true
    },
    clickSubmitIntent() {
      const promise = this.editIntentId
        ? this.apiPutIntent(this.agentId, {...this.intentData, intentId: this.editIntentId})
        : this.apiPostIntent(this.agentId, this.intentData)
      promise.then((newIntent) => {
        if (this.editIntentId) {
          const editedIntentId = this.intents.findIndex(intent => intent._id === this.editIntentId)
          this.intents.splice(editedIntentId, 1, newIntent)
        } else {
          this.intents.push(newIntent)
        }
        this.onCloseDialog()
      })
      .catch(error => {
        this.errorMessage = error
      })
    },
    clickEdit(intent) {
      this.initialIntentData = intent
      this.editIntentId = intent._id
      this.openNewIntentModal = true
    },
    clickDelete(intent) {
      this.$buefy.dialog.confirm({
        title: 'Please confirm',
        message: `You are going to delete intent "${intent.name}"`,
        onConfirm: () => {
          this.isLoading = true
          this.apiDeleteIntent(this.agentId, {intentId: intent._id})
            .catch(error => this.$buefy.notification.open({
              duration: 2000,
              message: error,
              position: 'is-bottom-right',
              type: 'is-danger',
              hasIcon: true
            }))
            .finally(() => this.loadIntents())
            .finally(() => this.isLoading = false)
        }
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
      this.isLoading = true
      this.loadIntents()
        .finally(() => this.isLoading = false)
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
.intents-list {
  margin-top: 2rem;
}
td .button:not(:last-child) {
  margin-right: 1rem;
}
.level {
  margin-top: 2rem;
}
</style>