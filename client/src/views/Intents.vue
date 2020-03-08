<template>
  <div>
    <h1 class="title">Agent intents</h1>
  </div>
</template>
<script>
import apiIntents from '@/api/mixins/apiIntents'
export default {
  name: 'Intents',
  mixins: [apiIntents]
}
</script>