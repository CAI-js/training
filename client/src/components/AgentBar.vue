<template>
  <div class="has-background-primary wrapper">
    <div class="agent-management">
      <img class="agent-image" src="/chatbot.svg" alt="">
      <b-button type="is-primary" inverted icon-right="plus">Create new agent</b-button>
    </div>
    <div class="training-menu">

    </div>
  </div>
</template>
<script>
import apiAgent from '@/api/mixins/apiAgent'

export default {
  name: 'AgentBar',
  mixins: [apiAgent],
  data() {
    return {
      agents: []
    }
  },
  created () {
    this.apiGetAgents()
      .then(result => this.agents = result)
  }
}
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
</style>