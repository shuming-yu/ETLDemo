<template>
  <div class="node-container">
    <Handle
      type="target"
      :position="Position.Top"
      class="custom-handle"
    />

    <div class="node-label">
      <div class="column box" :style="{ color: data.Color }">
        <div>{{ data.ETLName }}</div>
        <div>Period ({{ data.Period }})</div>
      </div>
    </div>

    <Handle
      type="source"
      :position="Position.Bottom"
      class="custom-handle"
    />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position, type NodeProps } from '@vue-flow/core'

const props = defineProps<NodeProps>();
</script>


<style scoped>
.node-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: auto;
}

/* Handle default size and styling */
.custom-handle {
  width: 10px;
  height: 10px;
}

/* Change Handle color when Node is selected */
.vue-flow__node-default.selected .custom-handle {
  background-color: rgba(133, 211, 176, 0.81);
}
</style>

<style>
/* Default Node styling */
.vue-flow__node.vue-flow__node-default {
  width: unset;
  min-width: 150px;
}

.vue-flow__node-default.selected {
  background-color: rgba(133, 211, 176, 0.81);
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px;

  border-bottom-color: rgba(66, 185, 131, 0.8);
  border-left-color: rgba(66, 185, 131, 0.8);
  border-right-color: rgba(66, 185, 131, 0.8);
  border-top-color: rgba(66, 185, 131, 0.8);
}

/* Default Edge styling */
.vue-flow__edge-path, .vue-flow__connection-path {
  stroke-width: 3px;
}

/* Change Edge color when selected */
.vue-flow__edge.selected .vue-flow__edge-path {
  stroke: rgba(66, 185, 131, 0.8);
}
</style>
