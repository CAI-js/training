<template>
  <b-menu class="agent-menu is-size-5">
    <b-menu-list aria-role="menu">
      <b-menu-item
        v-for="section in sections"
        :key="section.name"
        :label="section.name"
        aria-role="menuitem"
        :active="$route.name === section.name"
        :icon="section.icon"
        tag="router-link"
        :to="getRoute(section.name)"
      />
    </b-menu-list>
  </b-menu>
</template>
<script>
export default {
  data () {
    return { sections: [
      {name: 'Domains', icon: 'folder-multiple-outline'},
      {name: 'Intents', icon: 'message-outline'},
      // {name: 'settings', label: 'Settings', icon: 'settings-outline'},
    ]}
  },
  methods: {
    getRoute(section) {
      return {
        name: section,
        params: { id: this.$route.params.id }
      };
    }
  }
};
</script>
<style>
.agent-menu {
  margin-top: 4rem;
}
.agent-menu a:not(:hover) {
  color: whitesmoke;
}
.agent-menu .menu-list a.is-active {
  background-color: whitesmoke;
  color: #363636;
}
.agent-menu .icon {
  margin-right: 0.25rem;
}
</style>