<template>
  <b-field class="domain-selector" v-show="domains.length > 0" aria-label="Domain selector" :type="{'is-primary': !error, 'is-danger': error}" :label="showLabel ? 'Domain' : ''" :message="{'Please select a domain': error}">
    <b-select
      expanded
      :value="selectedDomainId"
      @input="onSelectDomain"
    >
      <option value="" :disabled="required" :hidden="required">Select a domain</option>
      <option
          v-for="domain in domains"
          :value="domain._id"
          :key="domain._id"
          >
          {{ domain.name }}
      </option>
    </b-select>
  </b-field>
</template>
<script>
export default {
  props: {
    domains: {
      type: Array,
      required: true,
    },
    selectedDomainId: {
      type: String,
      default: ''
    },
    showLabel: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    required() {
      return this.$attrs.required || this.$attrs.required === '';
    }
  },
  methods: {
    onSelectDomain(domainId) {
      this.$emit('select-domain', domainId)
    }
  }
}
</script>