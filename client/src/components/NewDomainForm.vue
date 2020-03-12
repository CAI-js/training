<template>
  <form @change="formChange">
    <b-field label="Name">
      <b-input type="text" v-model="name" required :disabled="this.initialData"></b-input>
    </b-field>
    <b-field label="Language">
      <b-input type="text" v-model="language"></b-input>
    </b-field>
  </form>
</template>
<script>

export default {
  name: "NewDomainForm",
  props: {
    initialData: {
      type: Object,
      default: {
        name: '',
        language: ''
      }
    }
  },
  data() {
    return {
      name: this.initialData.name,
      language: this.initialData.language,
      errors: {
        name: true,
        language: false,
      }
    }
  },
  methods: {
    validateForm() {
      this.errors = {
        name: !this.name,
      }
    },
    formChange() {
      this.validateForm()
        this.$emit('form-change', {
        valid: this.formIsValid,
        data: {
          name: this.name,
          language: this.language,
        }})
    }
  },
  computed: {
    formIsValid() {
      for (const key in this.errors) {
        if (this.errors[key] === true) return false
      }
      return true
    },
  },
}
</script>