<template>
  <div class="has-background-primary wrapper">
    <div class="agent-management">
      <img class="agent-image" src="../assets/chatbot.svg" alt />
      <b-button type="is-primary" inverted icon-right="plus" @click="clickNewAgent">Create new agent</b-button>
    </div>
    <div class="training-menu"></div>
    <b-modal
      :active.sync="openNewAgentModal"
      trap-focus
      aria-role="dialog"
      aria-modal
      has-modal-card
    >
      <div class="card">
        <div class="card-content">
          <h1 class="title">New agent</h1>
        <p class="has-text-danger error-message" v-if="errorMessage">{{errorMessage}}</p>
          <new-agent-form @form-valid-change="onFormValidChange"/>
          <div class="level">
            <b-button
              @click="clickSubmitAgent"
              type="is-primary"
              :disabled="!isValidForm"
            >
              Create
            </b-button>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import apiAgent from '@/api/mixins/apiAgent';

export default {
  name: "AgentBar",
  mixins: [apiAgent],
  components: {
    'new-agent-form': () => import(/* webpackChunkName: "extras" */'./NewAgentForm')
  },
  data() {
    return {
      agents: [],
      openNewAgentModal: false,
      isValidForm: false,
      errorMessage: '',
      agentData: {}
    };
  },
  created() {
    this.apiGetAgents().then(result => (this.agents = result));
  },
  methods: {
    clickNewAgent() {
      this.openNewAgentModal = true;
    },
    clickSubmitAgent() {
      this.apiPostAgent(this.agentData)
        .then((newAgent) => {
          this.agents.push(newAgent)
          this.openNewAgentModal = false
          this.agentData = {}
        })
        .catch(error => {
          this.errorMessage = error
        })
    },
    onFormValidChange ({valid, data}) {
      this.errorMessage = ''
      this.isValidForm = valid
      if (valid) {
        this.agentData = data
      }
    },
  }
};
</script>
<style scoped>
.wrapper {
  grid-area: agent;
  padding: 2rem 1rem 1rem;
}
.agent-management {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.agent-image {
  width: 100%;
  max-width: 150px;
  margin-bottom: 1rem;
}
.error-message {
  margin-bottom: 1rem;
}
.level {
  margin-top: 2em;
}
</style>