<template>
  <form @change="formChange">
    <b-field label="Name">
      <b-input type="text" v-model="formData.name" required :disabled="this.initialData.name"></b-input>
    </b-field>
    <b-field class="domain-selector" v-show="domains.length > 0" aria-label="Domain selector" type="is-primary">
        <b-select placeholder="Select a domain" expanded v-model="formData.domain">
            <option
                v-for="domain in domains"
                :value="domain._id"
                :key="domain._id"
                >
                {{ domain.name }}
            </option>
        </b-select>
    </b-field>
  </form>
</template>
<script>
import formValidation from '../mixins/formValidation'

export default {
  name: "NewIntentForm",
  mixins: [formValidation],
  props: {
    initialData: {
      type: Object,
      default: () => ({
        name: '',
        domain: ''
      })
    },
    domains: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formData: {...this.initialData},
      errors: {
        name: true,
        domain: false,
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