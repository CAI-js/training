<template>
  <div class="wrapper has-background-primary">
    <b-dropdown aria-role="menu" class="is-pulled-right" position="is-bottom-left">
      <b-button slot="trigger" size="is-medium" type="is-primary" icon-right="menu-down" outlined inverted aria-label="user menu">
        <b-icon size="is-medium" icon="account"></b-icon>
      </b-button>
      <b-dropdown-item aria-role="menuitem" @click="clickLogOut">Log out</b-dropdown-item>
    </b-dropdown>
  </div>
</template>
<script>
import {lsClear} from '@/localStorage'
export default {
  name: 'UserBar',
  methods: {
    clickLogOut() {
      lsClear()
      this.$router.push({name: 'Login'})
    }
  }
}
</script>
<style scoped>
.wrapper {
  grid-area: user;
  padding: 1rem;
}
</style>