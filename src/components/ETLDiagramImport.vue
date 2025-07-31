<i18n src="./Resources//ETLInfo.json"></i18n>

<template>
  <q-dialog v-model="props.modelValue" persistent>
    <q-card style="width: 500px">
      <q-card-section>
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>{{ t("Import") }}</q-toolbar-title>
          <q-btn @click="closeDialog" flat round dense icon="close" />
        </q-toolbar>
      </q-card-section>

      <q-card-section>
        <div class="q-pa-md">
          <div class="row q-col-gutter-md q-px-md">
            <div v-if="props.isNewTopic" class="col-12">
              <q-select
                v-model="topicName"
                :options="topicList"
                :label="t('Topic')"
                outlined
                clearable
              />
            </div>

            <div v-else class="col-12">
              <q-input v-model="flowDiagram.Topic" :label="t('Topic')" outlined readonly dense />
            </div>

            <div class="col-12">
              <q-select
                v-model="databaseName"
                :options="databaseList"
                :label="t('DataBaseName') + '*'"
                outlined
                clearable
              />
            </div>

            <div class="col-12">
              <q-file
                clearable
                filled
                counter
                outlined
                v-model="jsonFile"
                :label="t('JsonFile')"
                accept=".json"
                @rejected="onRejected"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" @click.stop.prevent />
                </template>
              </q-file>
            </div>
          </div>


        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn @click="confirmImport" :label="t('Confirm')" color="primary" class="q-mr-sm" />
        <q-btn @click="closeDialog" :label="t('Cancel')" color="negative" outline />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUpdate } from 'vue';
import { httpGetRequest } from "@/utils/webUtil";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { useFlowDiagramStore } from "@/stores/flowDiagram";
const flowDiagram = useFlowDiagramStore();

const jsonFile = ref<File>();
const topicName = ref<{ label: string; value: string }>();  // 選取的Topic
const databaseName = ref<string>("");

onMounted(() => {
  getETLTopics();
  getETLDatabaseNames();
})

const topicList = ref<{ label: string; value: string }[]>([]); // 分類 下拉選單
/** 分類清單 */
function getETLTopics() {
  let url = "ETLManager/Common/GetETLTopics";
  // httpGetRequest(url)
  //   .then(res => {
  //     // console.log("GetETLTopics:", res);
  //     const result = res as Record<string, string>;
  //     const keyValues = Object.keys(result).map(x => ({
  //       label: x + '-' + result[x],
  //       value: x
  //     }));

  //     topicList.value = keyValues;
  //   })

  let res = {
    "FinancialReport": "財務報表",
    "GenerateInventoryData": "產生盤點資料",
    "SendCustomerList": "發送客戶清單",
    "PRO_INT_Vendor": "廠商主檔 ODS 2 INT",
    "BI_Inventory_Report": "BI庫存報表",
    "PRO_DM_MATERIAL_MONTHLY_PROCUREMENT_AMOUNT": "物料採購成本",
    "Topic1": "廠商主檔 ODS 2 INT廠商主檔 ODS 2 INT廠商主檔 ODS 2 INT",
    "PRO_INT_PART_ATTRIBUTE": "ODS_PRO_PART_MASTER to INT.INT_PRO_PURCHASING_PART_ATTRIBUTE",
    "PRO_INT_MONTHLY_PROCUREMENT_AMOUNT": "ODS_PRO_PURCHASING_AMOUNT,INT.INT_PRO_PURCHASING_PART_ATTRIBUTE to INT_PRO_MONTHLY_PROCUREMENT_AMOUNT",
    "PSG_EST_MONTHLY_REVENUE_DATA": "每月營業收入預估資料by客戶",
    "PSG_DOI": "P.3.5.0 PSG DOI"
  };
  const result = res as Record<string, string>;
  const keyValues = Object.keys(result).map(x => ({
    label: x + '-' + result[x],
    value: x
  }));

  topicList.value = keyValues;
}

const databaseList = ref<string[]>([]); // 分類 下拉選單
/** 分類清單 */
function getETLDatabaseNames() {
  let url = "ETLManager/Common/GetETLDatabaseNames";
  // httpGetRequest<string[]>(url)
  //   .then(res => {
  //     // console.log("GetETLDatabaseNames:", res);
  //     databaseList.value = res;
  //   })

  databaseList.value = ["ASUS","DGDEV","DGTest"];
}

/** 清空資料 */
onBeforeUpdate(() => {
  topicName.value = undefined;
  databaseName.value = "";
  jsonFile.value = undefined;

  getETLTopics();
  getETLDatabaseNames();
})

const props = defineProps({
  // show dialog
  modelValue: {
    type: Boolean,
    default: false,
  },

  // 新增匯入-true / 編輯匯入-false
  isNewTopic: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['update:modelValue', 'jsonFile']);

function closeDialog() {
  topicName.value = undefined;
  databaseName.value = "";
  jsonFile.value = undefined;
  emit('update:modelValue', false);
}

function confirmImport() {
  // emit('jsonFile', topicName.value?.value, databaseName.value, jsonFile.value);
}


import { useQuasar } from "quasar";
const $q = useQuasar();
function onRejected(rejectedEntries: string | any[]) {
  $q.notify({
    type: 'negative',
    // message: `${rejectedEntries.length} file(s) did not pass validation constraints`
    message: `File did not pass validation constraints!!`
  })
}
</script>

<style scoped>
.q-card__section {
  padding: 0;
}
</style>
