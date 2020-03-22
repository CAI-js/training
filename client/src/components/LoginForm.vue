<template>
  <form>
    <b-field v-show="fullForm" label="Name">
      <b-input type="text" v-model="formData.name" :required="fullForm"></b-input>
    </b-field>
    <b-field label="Email" >
      <b-input type="email" v-model="formData.email" required pattern="^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$"></b-input>
    </b-field>
    <b-field label="Password">
      <b-input type="password" v-model="formData.password" required></b-input>
    </b-field>
    <b-field v-show="fullForm" label="Confirm password">
      <b-input type="password" v-model="formData.confirmPassword" :required="fullForm" validation-message="The password and the confirmation have to match"></b-input>
    </b-field>
  </form>
</template>
<script>
import formValidation from '../mixins/formValidation'
export default {
  name: "LoginForm",
  mixins: [formValidation],
  props: {
    fullForm: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      errors: {
        name: false,
        email: false,
        password: false
      }
    }
  },
  methods: {
    validateForm() {
      this.errors = {
        name: this.fullForm && !this.formData.name,
        email: !this.formData.email || !this.formData.email.match(/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/),
        password: !this.formData.password || (this.fullForm && this.formData.password !== this.formData.confirmPassword)
      }
    },
  },
}
</script>