<template>
  <b-modal
    :active.sync="isOpen"
    trap-focus
    aria-role="dialog"
    aria-modal
    has-modal-card
    @close="close"
  >
    <div class="card">
      <div class="card-content">
        <h1 class="title">{{title}}</h1>
        <p class="has-text-danger error-message" v-if="errorMessage">{{errorMessage}}</p>
        <slot />
      </div>
    </div>
  </b-modal>
</template>
<script>
export default {
  name: 'DialogBase',
  props: {
    title: {
      type: String
    },
    errorMessage: {
      type: String
    },
    open: {
      type: Boolean,
      required: true,
    }
  },
  data() {
    return {
      isOpen: this.open || false
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  },
  watch: {
    open(value) {
      this.isOpen = value
    }
  }
}
</script>
<style scoped>
.error-message {
  margin-bottom: 1rem;
}
</style>