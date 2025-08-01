<i18n src="./Resources/ETLRelation.json"></i18n>

<template>
  <div class="page-height">
    <div class="column fit q-pa-sm">
      <div class="col full-height">
        <q-card>
          <q-card-section class="q-pa-none">
            <q-table grid dense :rows="table.rows" :columns="table.columns" :filter="table.filter" :rows-per-page-options=[0]>
              <template v-slot:top-right>
                <q-input class="q-pl-md" clearable dense debounce="300" v-model="table.filter" placeholder="Search">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>

              <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
                  <q-card class="no-shadow" bordered style="max-height: 115px;">
                    <q-card-section @click="navigateToEdit(props.row.Value, props.row.ETLVersion, props.row.Descr)" class="q-pb-none q-pt-sm cursor-pointer">
                      <!-- <q-badge v-if="!props.row.HasETLRelation" floating color="pink-13">New</q-badge> -->

                      <div class="text-subtitle1 ellipsis">
                        {{ props.row.Value }}

                        <q-tooltip v-if="props.row.Value.length > 25" class="text-body2" anchor="bottom middle" self="top middle">
                          <strong>{{ props.row.Value }}</strong>
                        </q-tooltip>
                      </div>
                      <div class="text-subtitle1 ellipsis">
                        {{ props.row.Descr }}

                        <q-tooltip v-if="props.row.Descr.length > 20" class="text-body2" anchor="bottom middle" self="top middle">
                          <strong>{{ props.row.Descr }}</strong>
                        </q-tooltip>
                      </div>
                    </q-card-section>

                    <q-card-actions class="row items-center justify-between q-pt-none">
                      <div class="col-6 q-gutter-sm q-px-sm" style="white-space: nowrap;">
                        <q-btn @click="navigateToEdit(props.row.Value, props.row.ETLVersion, props.row.Descr)" icon="sym_o_docs" size="md" round flat dense class="bg-secondary text-white">
                          <q-tooltip class="bg-secondary text-body2" anchor="bottom middle" self="top middle">
                            <strong>{{ t("View") }}</strong>
                          </q-tooltip>
                        </q-btn>
                        <q-btn @click="ExportDiagram(props.row.Value, props.row.Descr)" icon="sym_o_file_export" size="md" round flat dense class="bg-indigo-8 text-white">
                          <q-tooltip class="bg-indigo-8 text-body2" anchor="bottom middle" self="top middle">
                            <strong>{{ t("Export") }}</strong>
                          </q-tooltip>
                        </q-btn>
                        <q-btn @click="OpenExportDialog(props.row.Value)" icon="sym_o_file_copy" size="md" round flat dense class="bg-brown text-white">
                          <q-tooltip class="bg-brown text-body2" anchor="bottom middle" self="top middle">
                            <strong>{{ t("ExportToStage") }}</strong>
                          </q-tooltip>
                        </q-btn>
                        <q-btn @click="OpenClearDialog(props.row.Value, props.row.ETLVersion)" icon="sym_o_mop" size="md" round flat dense class="bg-negative text-white">
                          <q-tooltip class="bg-negative text-body2" anchor="bottom middle" self="top middle">
                            <strong>{{ t("ClearDiagram") }}</strong>
                          </q-tooltip>
                        </q-btn>
                      </div>

                      <div class="col-6 text-right">
                        <div class="text-caption text-grey-8">
                          {{ props.row.Editor }}
                        </div>
                        <div class="text-caption text-grey-8">
                          {{ `${date.formatDate(props.row.Udt, 'YYYY/MM/DD HH:mm:ss')}` }}
                        </div>
                      </div>
                    </q-card-actions>
                  </q-card>
                </div>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type QTableProps } from "quasar";
import { ref, reactive, onMounted } from 'vue'
import { httpGetRequest, httpPostRequest, httpDownloadJson, showSuccessNotify } from "@/utils/webUtil";
import { date, Dialog } from 'quasar'
import { useI18n } from "vue-i18n"
const { t } = useI18n();
import { useRouter } from 'vue-router';
const router = useRouter();

import PopupDialog from '@/components/PopupDialog.vue'
import type { ConstValueList } from "@/types/ConstValueList"
import type { ETLFlow } from "@/types/ETLFlow"

import { useFlowDiagramStore } from "@/stores/flowDiagram";
const flowDiagram = useFlowDiagramStore();

// 假資料
import allETLTopics from "@/data/allETLTopics.json";

onMounted(() => {
  getAllETLTopics();
})

const table = reactive<QTableProps>({
  filter: "",
  rows: [],
  columns: [
    { name: 'ID', label: t('ID'), field: 'ID', align: 'left', sortable: true },
    { name: 'Type', label: t('Type'), field: 'Type', align: 'left', sortable: true },
    { name: 'Value', label: t('Value'), field: 'Value', align: 'left', sortable: true },
    { name: 'Descr', label: t('Descr'), field: 'Descr', align: 'left', sortable: true },
    { name: 'Editor', label: t('Editor'), field: 'Editor', align: 'left', sortable: true },
    { name: 'Cdt', label: t('Cdt'), field: 'Cdt', align: 'left', sortable: true },
    { name: 'Udt', label: t('Udt'), field: 'Udt', align: 'left', sortable: true },
    { name: 'ETLVersion', label: t('ETLVersion'), field: 'ETLVersion', align: 'left', sortable: true },
    { name: 'HasETLRelation', label: t('HasETLRelation'), field: 'HasETLRelation', align: 'left', sortable: true },
  ],
});
const PRD = "P";
const STAGE = "S";

/** 查詢所有Topic */
function getAllETLTopics() {
  // rows.splice(0, rows.length);

  // let url = "ETLManager/ETLDiagram/GetAllETLTopics?version=" + PRD;
  // httpGetRequest<ConstValueList[]>(url)
  //   .then(res => {
  //     // console.log("getAllETLTopics:", res);
  //     rows.splice(0, 0, ...res);
  //   })
  table.rows = allETLTopics;
}

/** router切換 */
function navigateToEdit(topic: string, version: string, descr: string) {
  flowDiagram.Topic = topic;
  flowDiagram.Version = version;
  flowDiagram.Descr = descr;

  router.push(`/ETL/ETLDiagram/PRD?topic=${topic}&version=${version}`);
}

/** Export Diagram to JSON File  */
function ExportDiagram(topic: string, descr: string) {
  let url = "ETLManager/ETLDiagram/ExportDiagram?topic=" + topic;
  let fileName = `${topic}-${descr}.json`;
  // httpDownloadJson(url, {}, fileName);
}

/** 跳出清空Dialog */
function OpenExportDialog(topic: string) {
  let str = "STAGE";
  let message = t("MsgConfirmExport", [str]);

  Dialog.create({
    component: PopupDialog,
    componentProps: {
      title: t("Export"),
      titleClass: "bg-brown text-white",
      message
    }
  })
    .onOk(() => {
      // ExportPRD2StageVersion(topic);
    })
}

/** Export PRD Version to Stage Version */
function ExportPRD2StageVersion(topic: string) {
  let url = "ETLManager/ETLDiagram/ExportPRD2StageVersion?topic=" + topic;

  httpPostRequest(url, null)
    .then(res => {
      let message = `${t("Export")}${t("Success")}`;
      showSuccessNotify(message);

      router.push(`/ETL/ETLDiagram/STAGE?topic=${topic}&version=${STAGE}`);
    })
}

/** 跳出清空Dialog */
function OpenClearDialog(topic: string, version: string) {
  let str = t("Topic") + ': ' + topic;
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
      // ClearDiagram(topic, version);
    })
}

/** 清空Diagram by topic/version */
function ClearDiagram(topic: string, version: string) {
  let params = new URLSearchParams({
    topic: topic,
    version: version
  });
  let url = "ETLManager/ETLDiagram/ClearDiagram?" + params.toString();

  httpPostRequest(url, null)
    .then(res => {
      let message = `${t("ClearDiagram")}${t("Success")}`;
      showSuccessNotify(message);

      getAllETLTopics();
    })
}
</script>

<style scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* 单行省略号 */
}
</style>