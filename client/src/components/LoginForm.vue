<template>
  <form @change="validateForm" ref="form">
    <b-field v-show="fullForm" label="Name">
      <b-input type="text" v-model="name" :required="fullForm"></b-input>
    </b-field>
    <b-field label="Email" >
      <b-input type="email" v-model="email" required pattern="^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$"></b-input>
    </b-field>
    <b-field label="Password">
      <b-input type="password" v-model="password" required></b-input>
    </b-field>
    <b-field v-show="fullForm" label="Confirm password">
      <b-input type="password" v-model="confirmPassword" :required="fullForm" validation-message="The password and the confirmation have to match"></b-input>
    </b-field>
  </form>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "LoginForm",
  props: {
    fullForm: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
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
        name: this.fullForm && !this.name,
        email: !this.email || !this.email.match(/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/),
        password: !this.password || (this.fullForm && this.password !== this.confirmPassword)
      }
    },
  },
  computed: {
    formIsValid() {
      for (const key in this.errors) {
        if (this.errors[key] === true) return false
      }
      return true
    }
  },
  watch: {
    formIsValid: function (newValue) {
      this.$emit('form-valid-change', {
        valid: newValue,
        data: {name: this.name, email: this.email, password: this.password }})
    }
  }
});
</script>