<i18n src="./Resources/ETLRelation.json"></i18n>

<template>
  <q-page class="q-pa-sm bg-white page-height">

    <div class="row full-height" v-if="!$q.screen.lt.sm">
      <div class="col full-height" style="max-width: 300px">
        <q-card class="no-shadow full-height" bordered>
          <div class="q-pa-sm full-height">
            <Sidebar />
          </div>
        </q-card>
      </div>

      <div class="col q-px-xs full-height">
        <q-card class="no-shadow full-height" style="overflow: hidden;" bordered>
          <div class="row q-pa-sm q-col-gutter-xs full-height">
            <div class="col-12 row items-center q-gutter-xs">
              <q-btn @click="navigateToETLFlow" icon="arrow_back" size="md" round flat dense class="bg-grey-8 text-white">
                <q-tooltip class="bg-grey-8 text-body2" anchor="bottom middle" self="top middle">
                  <strong>{{ t("ArrowBack") }}</strong>
                </q-tooltip>
              </q-btn>
              <q-btn @click="OpenApproveDialog(flowDiagram.Topic)" icon="sym_o_fact_check" size="md" round flat dense class="bg-brown text-white">
                <q-tooltip class="bg-brown text-body2" anchor="bottom middle" self="top middle">
                  <strong>{{ t("Approve") }}</strong>
                </q-tooltip>
              </q-btn>
              <q-btn @click="SaveDiagram" icon="save" size="md" round flat dense class="bg-primary text-white">
                <q-tooltip class="bg-primary text-body2" anchor="bottom middle" self="top middle">
                  <strong>{{ t("Save") }}</strong>
                </q-tooltip>
              </q-btn>
              <q-btn @click="EditNode" icon="edit" size="md" round flat dense class="bg-secondary text-white">
                <q-tooltip class="bg-secondary text-body2" anchor="bottom middle" self="top middle">
                  <strong>{{ t("Edit") }}</strong>
                </q-tooltip>
              </q-btn>
              <q-btn @click="OpenClearDialog" icon="sym_o_mop" size="md" round flat dense class="bg-negative text-white">
                <q-tooltip class="bg-negative text-body2" anchor="bottom middle" self="top middle">
                  <strong>{{ t("ClearDiagram") }}</strong>
                </q-tooltip>
              </q-btn>
              <q-btn @click="importDialogVisible = true" icon="sym_o_convert_to_text" size="md" round flat dense class="bg-positive text-white">
                <q-tooltip class="bg-positive text-body2" anchor="bottom middle" self="top middle">
                  <strong>{{ t("Import") }}</strong>
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
              <div class="dnd-flow" @drop="onDrop($event, showDialog)">
                <VueFlow :nodes="nodes" :edges="edges" @dragover="onDragOver" @dragleave="onDragLeave" :apply-default="false" delete-key-code="Delete">
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

  <!-- Add -->
  <q-dialog v-model="addDialogVisible" persistent>
    <q-card style="width: 500px">
      <q-card-section class="q-pa-none">
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>{{ t("Setting") }}</q-toolbar-title>
        </q-toolbar>
      </q-card-section>

      <q-card-section>
        <div class="row q-px-lg q-pb-sm q-col-gutter-sm">
          <div class="col-12">
            <q-input v-model="flowDiagram.Topic" :label="t('Topic')" readonly />
          </div>
          <div class="col-12">
            <q-input v-model="flowDiagram.ETLName" :label="t('ETLName')" readonly />
          </div>
          <div class="col-12">
            <q-select
              v-model="flowDiagram.Period"
              :options="periodList"
              :label="t('Period') + '*'"
              outlined
              clearable
              emit-value
              map-options
            />
          </div>
          <div class="col-12">
            <q-input v-model="flowDiagram.Descr" :label="t('Descr')" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn :label="t('Confirm')" @click="assignPeriod" color="primary" class="q-mr-sm" />
        <q-btn :label="t('Cancel')" @click="onDropCancel(closeDialog)" color="negative" outline />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <ETLDiagramImport v-model="importDialogVisible" @jsonFile="ImportDiagram" :isNewTopic="false" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { httpGetRequest, httpPostRequest, showSuccessNotify, showWarnNotify, httpImportJsonFile } from "@/utils/webUtil";
import { Dialog } from 'quasar'
import PopupDialog from '@/components/PopupDialog.vue'
import { useI18n } from "vue-i18n"
const { t } = useI18n();
import { useRoute, useRouter } from 'vue-router';
const route  = useRoute();
const router = useRouter();


import { useFlowDiagramStore } from "@/stores/flowDiagram";
const flowDiagram = useFlowDiagramStore();
import Sidebar from '@/components/Sidebar.vue'
import DropzoneBackground from '@/components/DropzoneBackground.vue'
import ETLInfo from '@/components/ETLInfo.vue'


import { VueFlow, useVueFlow, MarkerType, Handle } from '@vue-flow/core'
import { Controls } from '@vue-flow/controls'
import EndNode from '@/components/EndNode.vue'
import DefaultNode from '@/components/DefaultNode.vue'
import useDragAndDrop from '@/utils/useDnD'
const { onConnect, addEdges, toObject, updateNode, onNodeClick, onEdgeClick, onNodeDoubleClick,
        onNodesChange, onEdgesChange, applyNodeChanges, applyEdgeChanges, setNodes, setEdges
} = useVueFlow();
const { onDragOver, onDrop, onDropCancel, onDragLeave, isDragOver } = useDragAndDrop();

// 假資料
import sendCustomerList from "@/data/sendCustomerList.json";

/** 新增Node時popup 並賦值 */
const addDialogVisible = ref(false);
const showDialog = () => {
  // 清空欄位值
  flowDiagram.Period = "";
  flowDiagram.Descr = "";

  addDialogVisible.value = true;
};
const closeDialog = () => {
  addDialogVisible.value = false;
};

/** 將輸入參數 assign 到對應 Node */
function assignPeriod() {
  if(!flowDiagram.Period || !flowDiagram.Period.trim()) {
    let message = t("MsgPleaseInput", [t("Period")]);
    showWarnNotify(message);
    return;
  }

  if (flowDiagram.NodeId) {
    updateNode(flowDiagram.NodeId, (node) => ({
      ...node,
      label: node.label,
      data: {
        ...node.data,
        // NodeId: flowDiagram.NodeId,
        // ETLName: flowDiagram.ETLName,
        Period: flowDiagram.Period,
        Version: flowDiagram.Version,
        Topic: flowDiagram.Topic,
        X: node.position.x,
        Y: node.position.y,
        Descr: flowDiagram.Descr,
        Color: "black"  // 預設 black
      },
    }));

    // checkHasNodeRelation();
  }

  addDialogVisible.value = false;
}

/** 新增Node時檢查是否有跟其他主題有關聯 */
function checkHasNodeRelation() {
  let params = new URLSearchParams({
    topic: flowDiagram.Topic,
    etlName: flowDiagram.ETLName,
    period: flowDiagram.Period,
  });
  let url = "ETLManager/ETLDiagram/CheckHasNodeRelation?" + params.toString();

  httpGetRequest<boolean>(url)
    .then(res => {
      // 根據回傳值更新 Node 樣式
      updateNode(flowDiagram.NodeId, (node) => ({
        ...node,
        data: {
          ...node.data,
          Color: res ? "red" : "black",
        },
      }));
    })
}

/** 編輯Node */
function EditNode() {
  if(!flowDiagram.NodeId || !flowDiagram.ETLName || !flowDiagram.Period) { return }

  addDialogVisible.value = true;
}

/** 新增自訂 Edge */
onConnect((params) => {
  // console.log("params:", params);

  addEdges({
    ...params,               // 保留 onConnect 傳遞的參數
    id: params.source + '-' + params.target,
    type: 'smoothstep',      // 可選：設定 Edge 類型
    markerEnd: MarkerType.ArrowClosed,
    data: {
      LinkId: params.source + '-' + params.target,
      SrcNodeId: params.source,
      // SrcNode: [],
      DestNodeId: params.target,
      // DestNode: [],
      // Level: 1
    },
  })
})

onMounted(() => {
  flowDiagram.Topic = route.query.topic as string;
  flowDiagram.Version = route.query.version as string;

  if(flowDiagram.Topic && flowDiagram.Version) {
    getETLDiagram(flowDiagram.Topic, flowDiagram.Version);   //取得ETL 關係結構圖
  }

  getETLPeriods();  //查詢ETL 所有區間定義
  ClearFlowDiagram(); //清空暫存資料
})

/** router切換 */
function navigateToETLFlow() {
  router.push("/ETL/ETLFlow/STAGE");
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

  let { Nodes, Links } = sendCustomerList;
  mappingVueFlow(Nodes as any, Links as any);
}

/** 查詢ETL 所有區間定義 */
const periodList = ref<{ label: string; value: string }[]>([]); // 分類 下拉選單
function getETLPeriods() {
  let url = "ETLManager/Common/GetETLPeriods";
  // httpGetRequest<any>(url)
  //   .then(res => {
  //     // console.log("GetETLPeriods:", res);
  //     const result = res as Record<string, string>;
  //     const keyValues = Object.keys(result).map(x => ({ label: x + '-' + result[x], value: x }));

  //     periodList.value = keyValues;
  //   })

  let res = {
    "R": "週期單位:15分鐘, ex:[00,15,30,45]",
    "F": "週期單位:30分鐘, ex:[00,30]",
    "H": "週期單位:1小時, 每個整點, ex:[01:00,12:00,23:00]",
    "S": "週期單位:1節, ex:[ 08:00-13:00,13:00-17:00,17:00-20:30,20:30-23:00,23:00-03:00,03:00-08:00]",
    "C": "週期單位:1班, ex:[ 08:00-20:30,20:30-08:00]",
    "P": "週期單位:1天(自訂起迄時間), ex:[08:00-隔天08:00]",
    "D": "週期單位:1天(系統日), ex:[00:00-隔天00:00]",
    "W": "週期單位:1周, 星期日為一周第一天,星期六為一周最後一天",
    "M": "週期單位:1月",
    "Q": "週期單位:1季",
    "Y": "週期單位:1年"
  };
  const result = res as Record<string, string>;
  const keyValues = Object.keys(result).map(x => ({ label: x + '-' + result[x], value: x }));
  periodList.value = keyValues;
}

/** 跳出核准Dialog */
function OpenApproveDialog(topic: string) {
  let str = "PRD";
  let message = t("MsgConfirmApprove", [str]);

  Dialog.create({
    component: PopupDialog,
    componentProps: {
      title: t("Approve"),
      titleClass: "bg-brown text-white",
      message
    }
  })
    .onOk(() => {
      // ApproveStage2PRDVersion(topic);
    })
}

/** 確認ETL Relation Stage to PRD Version */
function ApproveStage2PRDVersion(topic: string) {
  let url = "ETLManager/ETLDiagram/ApproveStage2PRDVersion?topic=" + topic;
  // httpPostRequest(url, null)
  //   .then(res => {
  //     let message = `${t("Approve")}${t("Success")}`;
  //     showSuccessNotify(message);

  //     router.push("/ETL/ETLFlow/STAGE");
  //   })

  let message = `${t("Approve")}${t("Success")}`;
  showSuccessNotify(message);
  router.push("/ETL/ETLFlow/STAGE");
}

/** position 重新賦值, 並取出含有 sourceX 參數 */
function handleAssignPosition(nodes: any, edges: any) {
  nodes.forEach((node: any) => {
    node.data.X = Math.round(node.position.x);
    node.data.Y = Math.round(node.position.y);
  });

  return edges.filter((edge: any) => edge.hasOwnProperty('sourceX'));
}

/** 前台保存後最後送完整圖資給Server保存 */
function SaveDiagram() {
  let data = toObject();
  // console.log("data:", data);
  const filteredEdges = handleAssignPosition(data.nodes, data.edges);

  let input: ETLFlow = {
    Version: flowDiagram.Version,
    Topic: flowDiagram.Topic,
    Nodes: data.nodes.map(node => node.data),
    Links: filteredEdges.map((edge: { data: any }) => edge.data)
  }
  // console.log("input:", input);

  let url = "ETLManager/ETLDiagram/SaveDiagram";
  // httpPostRequest<ETLFlow>(url, input)
  //   .then(res => {
  //     // console.log("SaveDiagram:", res);
  //     let message = `${t("Save")}${t("Success")}`;
  //     showSuccessNotify(message);
  //   })

  let message = `${t("Save")}${t("Success")}`;
  showSuccessNotify(message);
}

/** 跳出清空Dialog */
function OpenClearDialog() {
  let str = t("Topic") + ': ' + flowDiagram.Topic;
  let message = t("MsgConfirmClear", [str]);

  Dialog.create({
    component: PopupDialog,
    componentProps: {
      title: t("ClearDiagram"),
      titleClass: "bg-negative text-white",
      message
    }
  })
    .onOk(() => {
      ClearDiagram();
    })
}

/** 清空Diagram by topic/version */
function ClearDiagram() {
  let params = new URLSearchParams({
    topic: flowDiagram.Topic,
    version: flowDiagram.Version
  });
  let url = "ETLManager/ETLDiagram/ClearDiagram?" + params.toString();

  // httpPostRequest(url, null)
  //   .then(res => {
  //     let message = `${t("ClearDiagram")}${t("Success")}`;
  //     showSuccessNotify(message);

  //     getETLDiagram(flowDiagram.Topic, flowDiagram.Version);
  //   })
}

/** 清空 nodes / edges */
const resetTransform = () => {
  nodes.value = [];
  edges.value = [];
}

import ETLDiagramImport from '@/components/ETLDiagramImport.vue'
const importDialogVisible = ref<boolean>(false);
/** Import JSON File to diagram */
function ImportDiagram(topic: string, database: string, file: File) {
  if(!database) {
    let message = t("MsgPleaseSelect", [t("DataBaseName")]);
    showWarnNotify(message);
    return;
  }
  else if(!file) {
    let message = t("MsgPleaseSelect", [t("JsonFile")]);
    showWarnNotify(message);
    return;
  }

  let url = "ETLManager/ETLDiagram/ImportDiagram";
  httpImportJsonFile<ETLFlow>(url, flowDiagram.Topic, database, file)
    .then(res => {
      importDialogVisible.value = false;
      resetTransform();
      // console.log("ImportDiagram:", res);
      mappingVueFlow(res.Nodes, res.Links);

      let message = `${t("Import")}${t("Success")}`;
      showSuccessNotify(message);
    })
    .catch(err => {
      console.log(err);
    });
}


/** 刪除 Node / Edge 功能 */
const selected = ref<string>(""); // 選擇的 Node / Edge Label
const waitable = ref(); // Pending Promise
let isDeleteConfirmed = false; // 狀態標誌：用於判斷是否已確認刪除

function openDeleteDialog() {
  if (!waitable.value) {
    waitable.value = new Promise<boolean>((resolve) => {
      let message = t("MsgConfirmDelete", [selected.value]);
      Dialog.create({
        component: PopupDialog,
        componentProps: {
          title: t("Delete"),
          titleClass: "bg-negative text-white",
          message
        }
      })
        .onOk(async () => {
          resolve(true);
          waitable.value = null;
        })
        .onCancel(async () => {
          resolve(false);
          waitable.value = null;
        })
        .onDismiss(() => {
          resolve(false);
          waitable.value = null;
        });
    });
  }

  return waitable.value;
}

onNodesChange(async (changes) => {
  const nextChanges = [];

  for (const change of changes) {
    if (change.type === 'remove') {

      // 處理新增Node時取消狀況
      if (flowDiagram.ControlDeleteNode) {
        nextChanges.push(change);
        flowDiagram.ControlDeleteNode = false;
      } else {
        const isConfirmed = await openDeleteDialog();

        if (isConfirmed) {
          // 清空 ETL清單/屬性 資料
          tempETLNameInfo.value = undefined;
          tempETLExecuteData.value = undefined;

          nextChanges.push(change);
        }
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

      if (!isDeleteConfirmed) {
        // 如果尚未確認刪除，彈出確認對話框
        const isConfirmed = await openDeleteDialog();

        if (isConfirmed) {
          isDeleteConfirmed = true; // 標記刪除已被確認
          nextChanges.push(change); // 刪除當前的 Edge
        } else {
          break; // 如果取消刪除，退出循環
        }
      } else {
        // 如果已確認刪除，直接刪除剩餘的 Edge
        nextChanges.push(change);
      }

    } else {
      nextChanges.push(change);
    }
  }

  isDeleteConfirmed = false; // 重置刪除確認標誌
  applyEdgeChanges(nextChanges);
});


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
    "NodeName": "Customer_CheckCustomer",
    "NodeId": "00638689177827119272",
    "Period": "W",
    // "Version": "",
    "Topic": "SendCustomerList",
    "X": "0",
    "Y": "0",
    "Name": "Customer_CheckCustomer",
    "DataBaseName": "DGTest",
    "ExportName": "[dbo].[ETL_Customer_CheckCustomer]",
    "Type": "SP",
    "Category": "Customer",
    "OwnerEmail": "yao.nai-wen@inventec.com",
    "Descr": "檢查客戶清單",
    "Editor": "IEC070511",
    "Udt": "2024-11-01T11:11:41.837",
    "Cdt": "2024-11-01T11:11:41.837"
  };
}

/** 抓ETL執行結果 */
let tempETLExecuteData = ref<ETLData>();
function GetETLExecuteData(ETLName: string, Period: string, ExcludeTopic: string, Version: string) {
  let params = new URLSearchParams({
    etlName: ETLName,
    period: Period,
    excludeTopic: ExcludeTopic,
    version: Version
  });
  let url = "/ETLManager/ETLDiagram/GetETLExecuteData?" + params.toString();

  // httpGetRequest<ETLData>(url)
  //   .then(res => {
  //     // console.log("GetETLExecuteData:", res);
  //     tempETLExecuteData.value = res;
  //   })

  tempETLExecuteData.value = {
    "ID": 7,
    "ETLName": "Customer_CheckAddress",
    "Period": "W",
    "Before": "2024-10-26T00:00:00",
    "FromPeriod": "2024-11-02T00:00:00",
    "ToPeriod": "2024-11-30T00:00:00",
    "After": "2024-12-07T00:00:00",
    "UsageTime": 6,
    "ReturnCode": 0,
    "ErrorText": "",
    // "Editor": "Job",
    // "Udt": "2024-12-03T15:00:01.26",
    // "Cdt": "2024-12-03T15:00:01.19",
    "Category": "",
    "Topic": "",
    "Level": 1,
    "Dependence": ""
  };
}

// 點選 Node
onNodeClick(({ event, node }) => {
  // console.log('onNodeClick:', node);

  let { ETLName, Topic, Period, NodeId, Version, Descr } = node.data;
  if(ETLName == "END") {
    selected.value = 'Node:' + ETLName;

    ClearFlowDiagram();
  }else {
    selected.value = 'Node:' + ETLName + '-Period (' + Period + ')';

    // 賦值於flowDiagram - 編輯
    flowDiagram.NodeId = NodeId;
    flowDiagram.ETLName = ETLName;
    flowDiagram.Period = Period;
    flowDiagram.Descr = Descr;
  }

  /** 處理渲染 ETL清單/屬性 */
  if(ETLName == "END") {
    tempETLNameInfo.value = undefined;
    tempETLExecuteData.value = undefined;
    return;
  }

  if(ETLName) {
    GetETLNameInfo(ETLName, Topic, Period, NodeId);
    GetETLExecuteData(ETLName, Period, Topic, Version);
  }
})

// 點選 Edge
onEdgeClick(({ event, edge }) => {
  // console.log('Edge clicked:', edge);
  ClearFlowDiagram();

  let srcNodeLabel = edge.sourceNode.data.ETLName;
  let destNodeLabel = edge.targetNode.data.ETLName;
  selected.value = 'Link:' + srcNodeLabel + '-' + destNodeLabel;
})

/** 重新整理 */
function Refresh() {
  getETLDiagram(flowDiagram.Topic, flowDiagram.Version);

  tempETLNameInfo.value = undefined;
  tempETLExecuteData.value = undefined;
}

/** 清空暫存資料 */
function ClearFlowDiagram() {
  flowDiagram.NodeId = "";
  flowDiagram.ETLName = "";
  flowDiagram.Period = "";
  flowDiagram.Descr = "";
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