<template>
  <main>
    <div class="hero" v-if="!this.$route.params.id">
      <div class="hero-body">
        <!-- TODO: improve design -->
        <p class="has-text-centered">Please, select an agent or create one</p>
        <div class="image-wrapper">
          <figure class="image is-square">
            <img src="@/assets/CAI-logo.png" alt=""/>
          </figure>
        </div>
      </div>
    </div>
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
  overflow: auto;
}
.image-wrapper {
  width: 50%;
  margin: 2rem auto;
}
</style>