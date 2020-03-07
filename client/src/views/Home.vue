<template>
  <div class="home">
    <user-bar />
    <agent-bar />
    <main>MAIN</main>
    <demo-bar />
  </div>
</template>

<script>
import UserBar from '@/components/UserBar'
import AgentBar from '@/components/AgentBar'
import DemoBar from '@/components/DemoBar'


export default {
  name: 'Home',
  components: {
    'user-bar': UserBar,
    'agent-bar': AgentBar,
    'demo-bar': DemoBar
  }
}
</script>
<style scoped>
.home {
  display: grid;
  grid-template-areas: "user user user" "agent main demo";
  grid-template-rows: min-content 1fr;
  grid-template-columns: max-content 1fr max-content;
}
main {
  grid-area: main;
  background-color: yellow;
}
</style>
