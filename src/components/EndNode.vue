<template>
  <q-icon name="radio_button_checked" size="4em" />

  <Handle type="target" :position="Position.Top" />
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
</script>

<style scoped>
.vue-flow__handle {
  width: 10px;
  height: 10px;
}
</style>