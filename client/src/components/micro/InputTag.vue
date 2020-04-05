<template>
  <div>
    <b-field
      :label="label"
      :message="[{'Add a new entry with enter': tags.length === 0}, errorMessage]"
      :type="{'is-danger': errorMessage}"
    >
      <b-input type="text" v-model="currentInput" @keyup.native.enter="handleEnter"></b-input>
    </b-field>
    <b-taglist v-show="tags.length > 0">
      <b-tag
        v-for="tag in tags"
        :key="tag"
        type="is-light"
        size="is-medium"
        :closable="true"
        :aria-close-label="`Delete ${tag} tag`"
        @close="$emit('remove-tag', tag)"
      >{{tag}}</b-tag>
    </b-taglist>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String
    },
    tags: {
      type: Array,
      default: () => []
    },
    errorMessage: {
      type: String
    }
  },
  data() {
    return {
      currentInput: ''
    }
  },
  methods: {
    handleEnter() {
      this.$emit('add-tag', this.currentInput)
      this.currentInput = ''
    }
  }
}
</script>