<template>
  <form @change="formChange">
    <b-field label="Name">
      <b-input type="text" v-model="formData.name" required :disabled="initialData.name"></b-input>
    </b-field>
    <domain-selector
      :domains="domains"
      :selectedDomainId="formData.domainId"
      :showLabel="true"
      :error="errors.domain"
      required
      @select-domain="onSelectDomainId"/>
    <input-tag
      label="Utterances"
      :tags="formData.utterances"
      :errorMessage="errors.utterances ? 'Please add at least one utterance' : ''"
      @add-tag="onAddUtterance"
      @remove-tag="onRemoveUtterance"
    />
    <input-tag
      label="Answers"
      :tags="formData.answers"
      :errorMessage="errors.answers ? 'Please add at least one answer' : ''"
      @add-tag="onAddAnswer"
      @remove-tag="onRemoveAnswer"
    />
  </form>
</template>
<script>
const deepClone = require('rfdc')()
import formValidation from '../mixins/formValidation'
import DomainSelector from './micro/DomainSelector'
import InputTag from './micro/InputTag'

export default {
  name: "NewIntentForm",
  mixins: [formValidation],
  components: {
    'domain-selector': DomainSelector,
    'input-tag': InputTag
  },
  props: {
    initialData: {
      type: Object,
      default: () => ({
        name: '',
        domain: {}
      })
    },
    domains: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formData: deepClone(this.initialData),
      errors: {
        name: true,
        domain: false,
        utterances: false,
        answers: false
      }
    }
  },
  methods: {
    validateForm() {
      this.errors = {
        name: !this.formData.name,
        domain: !this.formData.domainId,
        utterances: !this.formData.utterances || this.formData.utterances.length === 0,
        answers: !this.formData.answers || this.formData.answers.length === 0
      }
    },
    onSelectDomainId(eventData) {
      this.formData.domainId = eventData
    },
    addToFormDataArray(arrayName, value) {
        if (!this.formData[arrayName]) {
          this.formData[arrayName] = []
        }
        this.formData[arrayName].push(value)
        this.formData = {...this.formData}
    },
    removeToFormDataArray(arrayName, value) {
      const valueIndex = this.formData[arrayName].findIndex(item => item === value)
      if (valueIndex !== -1) {
        this.formData[arrayName].splice(valueIndex, 1)
      }
    },
    onAddUtterance(eventData) {
      if (eventData) {
        this.addToFormDataArray('utterances', eventData)
      }
    },
    onAddAnswer(eventData) {
      if (eventData) {
        this.addToFormDataArray('answers', eventData)
      }
    },
    onRemoveUtterance(eventData) {
      this.removeToFormDataArray('utterances', eventData)
    },
    onRemoveAnswer(eventData) {
      this.removeToFormDataArray('answers', eventData)
    }
  },
}
</script>