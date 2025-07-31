<i18n src="./Resources/ETLGroupByTopic.json"></i18n>

<template>
  <div :class="outerClass">
    <div class="column fit q-col-gutter-sm">
      <div class="col full-width">
        <q-table
          :rows="tableETLData.rows"
          :columns="tableETLData.columns"
          :filter="tableETLData.filter"
          :rows-per-page-options="[0]"
          @row-click="tableETLData.onRowClick"
          class="full-height"
          :id="TABLE_ETLDATA_ID"
          bordered
          dense
          flat
        >
          <template #top>
            <div class="q-table__title">{{ t("TitleETLData") }}</div>
            <div class="col">
              <div class="row justify-end q-gap-sm">
                <q-input
                  v-model="tableETLData.filter"
                  :label="t('Search')"
                  color="primary"
                  dense
                  clearable
                >
                  <template #prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </div>
          </template>

          <template #body-cell-Action="props">
            <q-td>
              <q-btn
                :id="`${BUTTON_ETLDATA_PREFIX}${props.row.ID}`"
                color="blue"
                icon="search"
                flat
                round
                dense
              >
                <q-tooltip>{{ t("QueryETLLog") }}</q-tooltip>
              </q-btn>
            </q-td>
          </template>

          <template #body-cell-ReturnCode="{ row: { ReturnCode } }">
            <q-td>
              <div class="row items-center no-wrap">
                <q-badge
                  :color="ReturnCode == 0 ? 'green' : 'red'"
                  class="q-mx-sm"
                  rounded
                />
                <span v-show="ReturnCode != 0">{{ ReturnCode }}</span>
              </div>
            </q-td>
          </template>
        </q-table>
      </div>

      <div class="col full-width">
        <q-table
          :rows="tableETLLog.rows"
          :columns="tableETLLog.columns"
          :filter="tableETLLog.filter"
          :rows-per-page-options="[0]"
          class="full-height"
          bordered
          dense
          flat
        >
          <template #top>
            <div class="q-table__title">{{ t("TitleETLLog") }}</div>
            <div class="col">
              <div class="row justify-end q-gap-sm">
                <div class="text-caption self-end">{{ t("DisplayRecordCount", [recordCount]) }}</div>
                <q-input
                  v-model="tableETLLog.filter"
                  :label="t('Search')"
                  color="primary"
                  dense
                  clearable
                >
                  <template #prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </div>
          </template>

          <template #body-cell-ReturnCode="{ row: { ReturnCode } }">
            <q-td>
              <div class="row items-center no-wrap">
                <q-badge
                  :color="ReturnCode == 0 ? 'green' : 'red'"
                  class="q-mx-sm"
                  rounded
                />
                <span v-show="ReturnCode != 0">{{ ReturnCode }}</span>
              </div>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ETLData } from "@/types/ETLData";
import type { ETLLog } from "@/types/ETLLog";
import type { QTableProps } from "quasar";

import { ref, reactive, watch, onMounted, toRefs } from "vue";
import { httpGetRequest, columnFormat } from "@/utils/webUtil";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const TABLE_ETLDATA_ID = "table_etl_data";
const BUTTON_ETLDATA_PREFIX = "btn_etldata_query_";

//#region  Declare Type
enum TagNameEnum {
  td = "TD",
  i = "I",
}

type LoaderName = {
  ETLName: string;
  Period: string;
};

interface QueryETLDataProps {
  outerClass?: string;
  /**
   * 指定ETLName, 查詢ETLData
   */
  etlNames?: string[];
  /**
   * 指定ETLData, 查詢ETLLog
   */
  etlNode?: LoaderName | null;
}
//#endregion

const props = withDefaults(defineProps<QueryETLDataProps>(), {
  outerClass: "q-pa-sm page-height",
});

let { outerClass, etlNames, etlNode } = toRefs(props);

// 監聽外部參數
watch(etlNames, (newValue) => {
  getETLDatas(newValue);
});

onMounted(() => {
  getETLDatas();
});

function getETLDatas(names?: string[]) {
  // special case: 有外部參數
  if (names && names.length == 0) {
    // 有外部參數, 但參數沒有資料, 表示選取的ETLTopic沒有對應的ETLData
    tableETLData.rows = [];
    tableETLLog.rows = [];
    return;
  }

  let url = "/ETLManager/ETLData/GetETLDatas?names=";
  if (names) {
    url += names.join(",");
  }

  httpGetRequest<ETLData[]>(url).then((res) => {
    tableETLData.rows = res;
    tableETLLog.rows = [];
  }).then(() => {
    triggerGetETLLog();
  });
}

function triggerGetETLLog() {
  resetRowChecked();

  if (etlNode.value) {
    let { ETLName, Period } = etlNode.value;
    let item = tableETLData.rows.find(
      (x) => x.ETLName == ETLName && x.Period == Period
    );

    if (item) {
      let id = `#${BUTTON_ETLDATA_PREFIX}${item.ID}`;
      let button = document.querySelector(id) as HTMLButtonElement;

      if (button) button.click();
    }
  }
}

function resetRowChecked() {
  let rows = document.querySelectorAll(`#${TABLE_ETLDATA_ID} tbody td.checked`);
  rows.forEach((x) => x.classList.remove("checked"));
}

const tableETLData = reactive<QTableProps>({
  rows: [],
  columns: [
    { name: "Action", label: t("Query"), field: "Action", align: "center", sortable: false, },
    { name: "ETLName", label: t("ETLName"), field: "ETLName", align: "left", sortable: true, },
    { name: "Period", label: t("Period"), field: "Period", align: "left", sortable: true, },
    { name: "ReturnCode", label: t("ReturnCode"), field: "ReturnCode", align: "center", },
    { name: "UsageTime", label: t("UsageTime"), field: "UsageTime", align: "center", sortable: true, },
    { name: "Before", label: t("Before"), field: "Before", align: "left", format: columnFormat.fullDateTime, sortable: true, },
    { name: "FromPeriod", label: t("FromPeriod"), field: "FromPeriod", align: "left", format: columnFormat.fullDateTime, sortable: true, },
    { name: "ToPeriod", label: t("ToPeriod"), field: "ToPeriod", align: "left", format: columnFormat.fullDateTime, sortable: true, },
    { name: "After", label: t("After"), field: "After", align: "left", format: columnFormat.fullDateTime, sortable: true, },
    { name: "ErrorText", label: t("ErrorText"), field: "ErrorText", align: "left", },
  ],
  filter: "",
  onRowClick: (evt, row, index) => {
    resetRowChecked();

    // 增加row check style
    let target = evt.target as Element;
    if (target.tagName != TagNameEnum.td) {
      target = target.closest("td") as Element;
    }
    target.classList.add("checked");

    getETLDataLogs(row);
  },
});

const tableETLLog = reactive<QTableProps>({
  rows: [],
  columns: [
    { name: "ActionName", label: t("ActionName"), field: "ActionName", align: "left", sortable: true, },
    { name: "ETLName", label: t("ETLName"), field: "ETLName", align: "left" },
    { name: "Period", label: t("Period"), field: "Period", align: "left" },
    { name: "ReturnCode", label: t("ReturnCode"), field: "ReturnCode", align: "center", },
    { name: "UsageTime", label: t("UsageTime"), field: "UsageTime", align: "center", sortable: true, },
    { name: "PeriodDate", label: t("PeriodDate"), field: "PeriodDate", align: "left", format: columnFormat.fullDateTime, sortable: true, },
    { name: "ErrorText", label: t("ErrorText"), field: "ErrorText", align: "left", },
    { name: "Cdt", label: t("Cdt"), field: "Cdt", align: "left", format: columnFormat.fullDateTime, sortable: true, },
    // { name: "Level", label: t("Level"), field: "Level", align: "left", sortable: true, },
  ],
  filter: "",
});

let recordCount = ref(100);

function getETLDataLogs(item: ETLData) {
  let { ETLName, Period } = item;
  let params = new URLSearchParams({
    period: Period,
    name: ETLName,
    recordCount: recordCount.value.toString(),
  });
  let url = "/ETLManager/ETLData/GetETLDataLogs?" + params.toString();

  httpGetRequest<ETLLog[]>(url).then((res) => {
    tableETLLog.rows = res;
  });
}
</script>
