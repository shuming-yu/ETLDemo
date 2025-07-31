<i18n src="./Resources/ETLRelation.json"></i18n>

<template>
  <q-page class="q-pa-sm bg-white page-height">

    <div class="row full-height" v-if="!$q.screen.lt.sm">
      <div class="col q-px-xs full-height">
        <q-card class="no-shadow full-height" style="overflow: hidden;" bordered>
          <div class="row q-pa-sm q-col-gutter-xs full-height">
            <div class="col-12 row items-center q-gutter-sm">
              <q-btn @click="navigateToETLFlow" icon="arrow_back" size="md" round flat dense class="bg-grey-8 text-white">
                <q-tooltip class="bg-grey-8 text-body2" anchor="bottom middle" self="top middle">
                  <strong>{{ t("ArrowBack") }}</strong>
                </q-tooltip>
              </q-btn>
              <q-btn @click="ExportDiagram" icon="sym_o_file_export" size="md" round flat dense class="bg-indigo-8 text-white">
                <q-tooltip class="bg-indigo-8 text-body2" anchor="bottom middle" self="top middle">
                  <strong>{{ t("Export") }}</strong>
                </q-tooltip>
              </q-btn>
              <q-btn @click="Refresh" icon="refresh" size="md" round flat dense class="bg-warning text-white">
                <q-tooltip class="bg-warning text-body2" anchor="bottom middle" self="top middle">
                  <strong>{{ t("Refresh") }}</strong>
                </q-tooltip>
              </q-btn>

              <div class="col">
                <q-input v-model="flowDiagram.Topic" :label="t('Topic')" outlined readonly dense />
              </div>
            </div>

            <div class="col-12 full-height" elevation="10">
              <div class="dnd-flow">
                <VueFlow :nodes="nodes" :edges="edges" @dragover="onDragOver" @dragleave="onDragLeave" :apply-default="false" delete-key-code="Delete" fit-view-on-init>
                  <DropzoneBackground
                    class="overlay"
                    :style="{
                      backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
                      transition: 'background-color 0.2s ease',
                    }"
                  >
                    <p v-if="isDragOver" class="drop-text">Drop here</p>
                  </DropzoneBackground>

                  <template #node-default="props">
                    <DefaultNode v-bind="props" />
                  </template>

                  <template #node-end="props">
                    <EndNode />
                  </template>

                </VueFlow>

                <Controls />
              </div>
            </div>
          </div>
        </q-card>
      </div>

      <div class="col-3 full-height">
        <q-card class="no-shadow full-height" bordered>
          <div class="full-height">
            <ETLInfo :ETLNameInfo="tempETLNameInfo" :ETLExecuteData="tempETLExecuteData" />
          </div>
        </q-card>
      </div>
    </div>

  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { httpGetRequest, httpDownloadJson } from "@/utils/webUtil";
import { useI18n } from "vue-i18n"
const { t } = useI18n();
import { useRoute, useRouter } from 'vue-router';
const route  = useRoute();
const router = useRouter();


import { useFlowDiagramStore } from "@/stores/flowDiagram";
const flowDiagram = useFlowDiagramStore();
import DropzoneBackground from '@/components/DropzoneBackground.vue'
import ETLInfo from '@/components/ETLInfo.vue'


import { VueFlow, useVueFlow, MarkerType } from '@vue-flow/core'
import { Controls } from '@vue-flow/controls'
import EndNode from '@/components/EndNode.vue'
import DefaultNode from '@/components/DefaultNode.vue'
import useDragAndDrop from '@/utils/useDnD'
const { onConnect, addEdges, toObject, updateNode, onNodeClick, onEdgeClick,
        onNodesChange, onEdgesChange, applyNodeChanges, applyEdgeChanges
} = useVueFlow();
const { onDragOver, onDrop, onDropCancel, onDragLeave, isDragOver } = useDragAndDrop();

// 假資料
import prdETLFlow from "@/data/prdETLFlow.json";

onMounted(() => {
  flowDiagram.Topic = route.query.topic as string;
  flowDiagram.Version = route.query.version as string;

  if(flowDiagram.Topic && flowDiagram.Version) {
    getETLDiagram(flowDiagram.Topic, flowDiagram.Version);   //取得ETL 關係結構圖
  }
})

/** router切換 */
function navigateToETLFlow() {
  router.push("/ETL/ETLFlow/PRD");
}

const nodes = ref<Node[]>([]);
const edges = ref<Edge[]>([]);
import type { Node, Edge, DefaultEdge, XYPosition, NodeChange } from '@vue-flow/core'
import type { ETLNode, ETLNodeLinks, ETLFlow, ETLNodeInfo } from "@/types/ETLFlow"
import type { ETLData } from "@/types/ETLData"

/**
 * Vue flow 三種樣式 - 拖拉顯示
 * input / default / output / end
*/
function getTypeByName(name: string) {
  if (name === 'END') return 'end';
  else return 'default';
}

/** 依照對應參數賦值 */
function mappingVueFlow(nodeList: ETLNode[], edgeList: ETLNodeLinks[]) {
  // Map ETLNodes to VueFlow nodes
  nodes.value = nodeList.map((node: ETLNode) => ({
    id: node.NodeId,
    label: node.ETLName,
    position: { x: parseFloat(node.X), y: parseFloat(node.Y) } as XYPosition,
    type: getTypeByName(node.ETLName),
    data: {
      ...node,
      X: parseFloat(node.X),
      Y: parseFloat(node.Y),
      Color: node.HasRelations ? 'red' : 'black'  // 手動新增 Color 參數
    }
  }));

  // Map ETLNodeLinks to VueFlow edges
  edges.value = edgeList.map((link: ETLNodeLinks) => ({
    id: link.LinkId,
    source: link.SrcNodeId,
    target: link.DestNodeId,
    type: 'smoothstep',
    markerEnd: MarkerType.ArrowClosed,
    data: { ...link }
  }));
}

/** 取得ETL 關係結構圖 */
function getETLDiagram(topic: string, version: string) {
  let params = new URLSearchParams({
    topic: topic,
    version: version
  });
  let url = "/ETLManager/ETLDiagram/GetETLDiagram?" + params.toString();

  // httpGetRequest<ETLFlow>(url)
  //   .then(res => {
  //     // console.log("GetETLDiagram:", res);
  //     mappingVueFlow(res.Nodes, res.Links);
  //   })

  // let res =
  let { Nodes, Links } = prdETLFlow;
  mappingVueFlow(Nodes as any, Links as any);
}

/** 刪除 Node / Edge 功能 */
let isDeleteConfirmed = false; // 狀態標誌：用於判斷是否已確認刪除

onNodesChange(async (changes) => {
  const nextChanges = [];

  for (const change of changes) {
    if (change.type === 'remove') {

      // 處理新增Node時取消狀況
      if (flowDiagram.ControlDeleteNode) {
        nextChanges.push(change);
        flowDiagram.ControlDeleteNode = false;
      }

    } else {
      nextChanges.push(change);
    }
  }

  applyNodeChanges(nextChanges);
});

onEdgesChange(async (changes) => {
  const nextChanges = [];

  for (const change of changes) {
    if (change.type === 'remove') {

      if (isDeleteConfirmed) {
        nextChanges.push(change);
      }

    } else {
      nextChanges.push(change);
    }
  }

  isDeleteConfirmed = false; // 重置刪除確認標誌
  applyEdgeChanges(nextChanges);
});


/** Export Diagram to JSON File  */
function ExportDiagram() {
  let url = "ETLManager/ETLDiagram/ExportDiagram?topic=" + flowDiagram.Topic;
  let fileName = `${flowDiagram.Topic}-${flowDiagram.Descr}.json`;
  // httpDownloadJson(url, {}, fileName);
}

/** 抓取ETL Name 訊息 */
let tempETLNameInfo = ref<ETLNodeInfo>();
function GetETLNameInfo(ETLName: string, Topic: string, Period: string, NodeId: string) {
  let params = new URLSearchParams({
    etlName: ETLName,
    topic: Topic,
    period: Period,
    nodeId: NodeId
  });
  let url = "/ETLManager/ETLDiagram/GetETLNameInfo?" + params.toString();

  // httpGetRequest<ETLNodeInfo>(url)
  //   .then(res => {
  //     // console.log("GetETLNameInfo:", res);
  //     tempETLNameInfo.value = res;
  //   })

  tempETLNameInfo.value = {
      "NodeName": "INT_PRO_PURCHASING_PART_ATTRIBUTE",
      "NodeId": "00638689944685418335",
      "Period": "D",
      // "Version": "",
      "Topic": "PRO_DM_MATERIAL_MONTHLY_PROCUREMENT_AMOUNT",
      "X": "0",
      "Y": "0",
      "Name": "INT_PRO_PURCHASING_PART_ATTRIBUTE",
      "DataBaseName": "DGDEV",
      "ExportName": "[sqlext].[ETL_INT_PRO_PURCHASING_PART_ATTRIBUTE_SP]",
      "Type": "SP",
      "Category": "DailyTask",
      "OwnerEmail": "wen.vivian@inventec.com",
      "Descr": "",
      "Editor": "IEC960919",
      "Udt": "2024-11-21T14:20:16.783",
      "Cdt": "2024-11-21T14:20:16.783"
  };
}

/** 抓ETL執行結果 */
let tempETLExecuteData = ref<ETLData>();
function GetETLExecuteData(ETLName: string, Period: string, ExcludeTopic: string) {
  let params = new URLSearchParams({
    etlName: ETLName,
    period: Period,
    excludeTopic: ExcludeTopic
  });
  let url = "/ETLManager/ETLDiagram/GetETLExecuteData?" + params.toString();

  // httpGetRequest<ETLData>(url)
  //   .then(res => {
  //     // console.log("GetETLExecuteData:", res);
  //     tempETLExecuteData.value = res;
  //   })

  tempETLExecuteData.value = {
      "ID": 14,
      "ETLName": "INT_PRO_PURCHASING_PART_ATTRIBUTE",
      "Period": "D",
      "Before": "2024-10-31T00:00:00",
      "FromPeriod": "2024-11-01T00:00:00",
      "ToPeriod": "2025-03-06T00:00:00",
      "After": "2025-03-07T00:00:00",
      "UsageTime": 2,
      "ReturnCode": 0,
      "ErrorText": "",
      // "Editor": "Job",
      // "Udt": "2025-03-07T00:00:06.937",
      // "Cdt": "2024-12-04T09:50:54.263",
      "Category": "",
      "Topic": "",
      "Level": 1,
      "Dependence": "ODS_PRO_PART_MASTER(D)@PRO_INT_PART_ATTRIBUTE-P"
  };
}

// 點選 Node
onNodeClick(({ event, node }) => {
  // console.log('onNodeClick:', node);
  let { ETLName, Topic, Period, NodeId } = node.data;

  /** 處理渲染 ETL清單/屬性 */
  if(ETLName == "END") {
    tempETLNameInfo.value = undefined;
    tempETLExecuteData.value = undefined;
    return;
  }

  if(ETLName) {
    GetETLNameInfo(ETLName, Topic, Period, NodeId);
    GetETLExecuteData(ETLName, Period, Topic);
  }
})


// 點選 Edge
onEdgeClick(({ event, edge }) => {
  // console.log('Edge clicked:', edge);
})

/** 重新整理 */
function Refresh() {
  getETLDiagram(flowDiagram.Topic, flowDiagram.Version);

  tempETLNameInfo.value = undefined;
  tempETLExecuteData.value = undefined;
}
</script>

<style scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  pointer-events: none;
}

.drop-text {
  font-size: 1.5em; /* Optional: adjust font size */
  color: #333; /* Optional: adjust text color */
}

.vue-flow__minimap {
  transform: scale(75%);
  transform-origin: bottom right;
}

.dnd-flow {
  flex-direction:column;
  display:flex;
  height:100%
}

.dnd-flow .vue-flow-wrapper {
  flex-grow: 1;
  height: 100%
}

@media screen and (min-width: 640px) {
  .dnd-flow {
    flex-direction:row
  }
}

.dropzone-background {
  position:relative;
  height:100%;
  width:100%
}

.dropzone-background .overlay {
  position:absolute;
  top:0;
  left:0;
  height:100%;
  width:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:1;
  pointer-events:none
}

.vue-flow__panel {
  background-color:#2d3748;
  color:#fff;
  border-radius:8px;
  padding:8px;
  display:flex;
  flex-direction:column;
  gap:8px
}

.q-card__section{
  padding: 0;
}
</style>