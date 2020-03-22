export default {
  created() {
    if (!this.formData) {
      console.error('You should create a formData object for the validation')
    }
    if (!this.errors) {
      console.error('You should have an error object for the validation')
    }
  },
  methods: {
    validateForm() {
      console.error('You should implement a custom validation function for the form')
    },
    formChange() {
      this.validateForm()
      this.$emit('form-change', {
        valid: this.formIsValid,
        data: this.formData
      })
    },
  },
  computed: {
    formIsValid() {
      for (const key in this.errors) {
        if (this.errors[key] === true) return false
      }
      return true
    },
  },
  watch: {
    formData: {
      deep: true,
      handler: function() {
        this.formChange()
      }
    }
  }
}