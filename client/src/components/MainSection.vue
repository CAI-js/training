<template>
  <main class="has-background-light">
    <router-view></router-view>
  </main>
</template>
<script>
export default {
  name: 'MainSection',
}
</script>
<style scoped>
main {
  grid-area: main;
  padding: 1rem;
}
</style>