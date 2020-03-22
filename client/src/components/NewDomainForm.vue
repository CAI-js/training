<template>
  <form @change="formChange">
    <b-field label="Name">
      <b-input type="text" v-model="formData.name" required :disabled="this.initialData.name"></b-input>
    </b-field>
    <b-field label="Language">
      <b-input type="text" v-model="formData.language"></b-input>
    </b-field>
  </form>
</template>
<script>
import formValidation from '../mixins/formValidation'

export default {
  name: "NewDomainForm",
  mixins: [formValidation],
  props: {
    initialData: {
      type: Object,
      default: () => ({
        name: '',
        language: ''
      })
    }
  },
  data() {
    return {
      formData: {...this.initialData},
      errors: {
        name: true,
        language: false,
      }
    }
  },
  methods: {
    validateForm() {
      this.errors = {
        name: !this.formData.name,
      }
    },
  },
}
</script>