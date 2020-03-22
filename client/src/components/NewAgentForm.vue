<template>
  <form>
    <b-field label="Name">
      <b-input type="text" v-model="formData.name" required></b-input>
    </b-field>
    <b-field label="Description">
      <b-input type="textarea" v-model="formData.description"></b-input>
    </b-field>
    <b-field label="Readers" :type="{'is-danger': this.errors.readers}" :message="{'Please use correct emails separated by commas or spaces': this.errors.readers}">
      <b-input type="textarea" v-model="formData.readers"></b-input>
    </b-field>
    <b-field label="Writers" :type="{'is-danger': this.errors.writers}" :message="{'Please use correct emails separated by commas or spaces': this.errors.writers}">
      <b-input type="textarea" v-model="formData.writers" ></b-input>
    </b-field>
  </form>
</template>
<script>
import formValidation from '../mixins/formValidation'

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
        description: '',
        readers: '',
        writers: '',
      },
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
        name: !this.formData.name,
        readers: this.parsedReaders ? !areValidEmails(this.parsedReaders) : false,
        writers: this.parsedWriters ? !areValidEmails(this.parsedWriters) : false
      }
    },
  },
  computed: {
    parsedReaders() {
      if (!this.formData.readers) return []
      return separateEmails(this.formData.readers)
    },
    parsedWriters() {
      if (!this.formData.writers) return []
      return separateEmails(this.formData.writers)
    }
  },
}
</script>