<i18n src="./Resources//ETLInfo.json"></i18n>

<template>
  <q-scroll-area class="full-height" style="max-width: 300px">
    <q-list style="max-width: 300px">
      <q-expansion-item
        v-for="(items, category) in NodeTemplates"
        :key="category"
        expand-separator
        :label="category"
        default-opened
        dense
      >
        <q-item
          v-for="(item, index) in items"
          :key="index"
          clickable
          v-ripple
          dense
        >
          <q-item-section avatar>
            <q-icon :name="getIconName(item.Type)" class="q-ml-sm" />
          </q-item-section>

          <q-item-section>
            <q-item-label>
              <div
                :class="getNodeName(item.Type)"
                :draggable="true"
                @dragstart="onDragStart($event, getNodeByType(item.Type), item.Name)"
                class="text-truncate"
              >
                {{ item.Name }}
                <q-tooltip class="bg-teal-8 text-body2" anchor="center right" self="center left">
                  <strong>{{ item.Name }}</strong>
                </q-tooltip>
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-expansion-item>
    </q-list>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { httpGetRequest } from "@/utils/webUtil";
import { useI18n } from "vue-i18n"
const { t } = useI18n();

import useDragAndDrop from '@/utils/useDnD'
const { onDragStart } = useDragAndDrop();

import { useFlowDiagramStore } from "@/stores/flowDiagram";
const flowDiagram = useFlowDiagramStore();

// 假資料
import nodeTemplates from "@/data/nodeTemplates.json";

onMounted(() => {
  GetNodeTemplates();
})


const NodeTemplates = ref<Record<string, Array<{ Name: string; Type: string; ExportName: string }>>>();
/** 畫面左邊所有ETL Name 清單GroupBy Category */
function GetNodeTemplates() {
  // let url = "ETLManager/ETLDiagram/GetNodeTemplates";
  // httpGetRequest<any>(url)
  //   .then(res => {
  //     // console.log("GetNodeTemplates:", res);
  //     NodeTemplates.value = res;
  //   })

  NodeTemplates.value = nodeTemplates;
}

function getIconName(type: string) {
  if (type === 'SP') return 'terminal';
  if (type === 'Component') return 'view_in_ar';
  if (type === 'System') return 'radio_button_checked';
  return 'terminal'; // Replace with the icon you want as default
}

/**
 * Vue flow 三種樣式 - 側邊顯示
 * vue-flow__node-input / vue-flow__node-default / vue-flow__node-output
 * @param type
 */
function getNodeName(type: string) {
  if (type === 'System') return 'vue-flow__node-output';
  if (type === 'SP') return 'vue-flow__node-default';
  if (type === 'Component') return 'vue-flow__node-default';
  return 'vue-flow__node-default';
}

/**
 * Vue flow 三種樣式 - 拖拉顯示
 * input / default / output
 * @param type
 */
function getNodeByType(type: string) {
  if (type === 'System') return 'end';
  if (type === 'SP') return 'default';
  if (type === 'Component') return 'default';
  return 'default';
}
</script>

<style scoped>
/** 處理文字超過長度 省略顯示 */
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>