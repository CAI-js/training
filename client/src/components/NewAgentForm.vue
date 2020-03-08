<template>
  <form @change="validateForm">
    <b-field label="Name">
      <b-input type="text" v-model="name" required></b-input>
    </b-field>
    <b-field label="Description">
      <b-input type="textarea" v-model="description"></b-input>
    </b-field>
    <b-field label="Readers" :type="{'is-danger': this.errors.readers}" :message="{'Please use correct emails separated by commas or spaces': this.errors.readers}">
      <b-input type="textarea" v-model="readers"></b-input>
    </b-field>
    <b-field label="Writers" :type="{'is-danger': this.errors.writers}" :message="{'Please use correct emails separated by commas or spaces': this.errors.writers}">
      <b-input type="textarea" v-model="writers" ></b-input>
    </b-field>
  </form>
</template>
<script>

function separateEmails(mailsString) {
  return mailsString.split(/[\s\t\n,;]/gm)
        .filter(element => !!element)
}
function areValidEmails(mailsArray) {
  function isValidMail(email) {
    return email.match(/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/)
  }
  for (const email of mailsArray) {
    if (!isValidMail(email)) {
      return false
    }
  }
  return true
}
export default {
  name: "NewAgentForm",
  props: {
    fullForm: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      name: '',
      description: '',
      readers: '',
      writers: '',
      errors: {
        name: true,
        readers: false,
        writers: false
      }
    }
  },
  methods: {
    validateForm() {
      this.errors = {
        name: !this.name,
        readers: this.parsedReaders ? !areValidEmails(this.parsedReaders) : false,
        writers: this.parsedWriters ? !areValidEmails(this.parsedWriters) : false
      }
    },
  },
  computed: {
    formIsValid() {
      for (const key in this.errors) {
        if (this.errors[key] === true) return false
      }
      return true
    },
    parsedReaders() {
      if (!this.readers) return []
      return separateEmails(this.readers)
    },
    parsedWriters() {
      if (!this.writers) return []
      return separateEmails(this.writers)
    }
  },
  watch: {
    formIsValid: function (newValue) {
      this.$emit('form-valid-change', {
        valid: newValue,
        data: {
          name: this.name,
          description: this.description,
          readers: this.parsedReaders,
          writers: this.parsedWriters
        }})
    }
  }
}
</script>