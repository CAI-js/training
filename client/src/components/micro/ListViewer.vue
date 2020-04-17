<template>
  <div>
    <template v-if="content.length === 1">{{content[0]}}</template>
    <template v-else>
      {{content[0]}}
      <b-collapse :open="false" position="is-bottom">
      <a slot="trigger" slot-scope="props">
        <b-icon :icon="!props.open ? 'menu-down' : 'menu-up'" size="is-medium"></b-icon>
        <span class="has-text-grey">{{ !props.open ? `View all ${content.length} elements` : 'Collapse ' }}</span>
      </a>
      <ul>
        <li v-for="item in filteredContent" :key="item">{{item}}</li>
      </ul>
      </b-collapse>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    content: {
      type: Array,
      required: true
    }
  },
  computed: {
    filteredContent() {
      return this.content.slice(1)
    }
  }
}
</script>
<style scoped>
a {
  display: inline-flex;
  align-items: center;
}
a .icon {
  width: 1.5rem;
  justify-content: flex-end;
}
</style>