<i18n src="./Resources/ETLGroupByTopic.json"></i18n>

<template>
  <q-table
    :rows="tableTopicGroup.displayRows"
    :columns="tableTopicGroup.columns"
    :filter="tableTopicGroup.filter"
    :filter-method="tableTopicGroup.filterMethod"
    :hideBottom="true"
    :rows-per-page-options="[0]"
    row-key="Topic"
    class="shadow-5 table-topicgroup"
    style="max-height: 100%;"
    flat
    dense
    bordered
  >
    <template #top v-if="showHeader">
      <div class="q-table__title">{{ t("TitleETLData") }}</div>
      <div class="col">
        <div class="row justify-end items-center">
          <m-select
            v-model="ddlTopic.modelValue"
            :options="ddlTopic.options"
            :label="t('ETLTopic')"
            style="width: 360px"
            color="blue"
            class="q-mr-sm"
            dense
            outlined
            emit-value
            map-options
            checked-ellipsis
            hide-bottom-space
          />

          <q-input
            v-model="tableTopicGroup.filter"
            :label="t('Search')"
            color="primary"
            clearable
            dense
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </template>

    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th auto-width />
        <q-th auto-width />
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>

    <template v-slot:body="props">
      <q-tr :props="props" class="text-bold" style="background-color: #e5f3f3;">
        <q-td>
          <q-btn
            :class="props.expand ? 'text-blue' : ''"
            :icon="
              props.expand ? 'keyboard_arrow_down' : 'keyboard_arrow_right'
            "
            size="sm"
            @click="props.expand = !props.expand"
            flat
            dense
            round
          />
        </q-td>
        <q-td colspan="3" class="text-blue">
          {{ props.row.Topic }}
        </q-td>
        <q-td>
          <div class="row items-center no-wrap">
            <q-badge
              :color="props.row.ReturnCode == 0 ? 'green' : 'red'"
              class="q-mx-sm"
              rounded
            />
            <span v-show="props.row.ReturnCode != 0">{{ props.row.ReturnCode }}</span>
          </div>
        </q-td>
        <q-td class="text-center">{{ columnFormat.fullDateTime(props.row.FromPeriod, null) }}</q-td>
        <q-td class="text-center">{{ columnFormat.fullDateTime(props.row.ToPeriod, null) }}</q-td>
        <q-td class="text-center">{{ props.row.Level }}</q-td>
        <q-td class="text-center">{{ props.row.UsageTime }}</q-td>
        <q-td></q-td>
      </q-tr>
      <!-- 展開Topic Group詳細資料 -->
      <template v-if="props.expand">
        <q-tr v-for="item in props.row.ETLDatas">
          <q-td></q-td>
          <q-td>
            <div class="row items-center">
              <q-btn
                icon="search"
                color="blue-8"
                @click="() => getETLDataLogs(item)"
                flat
                dense
                round
              >
                <q-tooltip class="bg-blue-8">{{ t("QueryETLLog") }}</q-tooltip>
              </q-btn>
            </div>
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <template v-if="col.name =='ReturnCode'">
              <div class="row items-center no-wrap">
                <q-badge
                  :color="item[col.name] == 0 ? 'green' : 'red'"
                  class="q-mx-sm"
                  rounded
                />
                <span v-show="item[col.name] != 0">{{ item[col.name] }}</span>
              </div>
            </template>
            <template v-else-if="col.name =='UsageTime'">
              <q-linear-progress :value="calcPercent(item, props.row)" size="1.5rem" color="green">
                <div class="absolute-full">
                  <div class="row fit justify-end q-pa-xs">
                    <q-badge
                      :label="`${calcPercent(item, props.row, true)}%`"
                      class="text-weight-bold"
                      color="white"
                      text-color="green"
                      style="font-size: .625rem"
                    />
                    <q-tooltip>{{ `${item.UsageTime} (ms)` }}</q-tooltip>
                  </div>
                </div>
              </q-linear-progress>
            </template>
            <template v-else-if="['FromPeriod', 'ToPeriod'].includes(col.name)">
              {{ columnFormat.fullDateTime(item[col.name], null) }}
            </template>
            <template v-else>{{ item[col.name] }}</template>
          </q-td>
        </q-tr>
      </template>
    </template>
  </q-table>

  <!-- ETL Log -->
  <q-dialog v-model="isShowTableETLLog">
    <q-card class="full-height" style="max-width: 80vw;">
      <q-card-section class="full-height q-pa-none">
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
              <div class="row justify-end items-center q-col-gutter-sm q-ma-none">
                <div class="text-caption self-end">{{ t("DisplayRecordCount", [recordCount]) }}</div>
                <q-input
                  v-model="tableETLLog.filter"
                  :label="t('Search')"
                  color="primary"
                  clearable
                  dense
                >
                  <template #prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>

                <q-btn icon="close" dense flat round v-close-popup></q-btn>
              </div>
            </div>
          </template>

          <template #body-cell-ReturnCode="{ row: detail }">
            <q-td>
              <div class="row items-center no-wrap">
                <q-badge
                  :color="detail.ReturnCode == 0 ? 'green' : 'red'"
                  class="q-mx-sm"
                  rounded
                />
                <span v-show="detail.ReturnCode != 0">{{ detail.ReturnCode }}</span>
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { ETLData, ETLDataGroup, ETLLog, Dictionary } from "@/types";
import type { QTableProps, QSelectProps, QSelectOption } from "quasar";

import { ref, reactive, onMounted, toRefs, computed, type ComputedRef } from "vue";
import { httpGetRequest, columnFormat } from "@/utils/webUtil";
import { useI18n } from "vue-i18n";

import MSelect from "@/components/MSelect.vue";

const { t } = useI18n();

interface ETLGroupByTopicProp {
  showHeader?: boolean;
  recordCount?: number;
}

interface QTablePropsEx extends QTableProps {
  displayRows?: ComputedRef
}

const props = withDefaults(defineProps<ETLGroupByTopicProp>(), {
  showHeader: false,
  recordCount: 100,
});

let { recordCount } = toRefs(props);

onMounted(() => {
  initial();
});

function calcPercent(detail: ETLData, row: ETLDataGroup, convert?: boolean): number {
  if (row.UsageTime == 0n) {
    return convert ? 100 : 1;
  }

  // if (convert == true) {
  //   return parseFloat((Number(detail.UsageTime / row.UsageTime) * 100).toFixed(0));
  // }

  // return Number(detail.UsageTime / row.UsageTime);

  if (convert == true) {
    return parseFloat(((Number(detail.UsageTime) / Number(row.UsageTime)) * 100).toFixed(0));
  }

  return Number(detail.UsageTime) / Number(row.UsageTime);
}

const tableTopicGroup = reactive<QTablePropsEx>({
  rows: [],
  columns: [
    // { name: "Action", label: t("Query"), field: "", align:s "left", sortable: false },
    { name: "ETLName", label: t("ETLName"), field: "ETLName", align: "left", sortable: false },
    { name: "Period", label: t("Period"), field: "Period", align: "left", sortable: false },
    { name: "ReturnCode", label: t("ReturnCode"), field: "ReturnCode", align: "left", sortable: false },
    { name: "FromPeriod", label: t("FromPeriod"), field: "FromPeriod", format: columnFormat.fullDateTime, align: "center", sortable: false },
    { name: "ToPeriod", label: t("ToPeriod"), field: "ToPeriod", format: columnFormat.fullDateTime, align: "center", sortable: false },
    { name: "Level", label: t("Level"), field: "Level", align: "center", sortable: false },
    { name: "UsageTime", label: t("UsageTime"), field: "UsageTime", align: "center", sortable: false },
    { name: "ErrorText", label: t("ErrorText"), field: "ErrorText", align: "left", sortable: false },
  ],
  filter: "",
  /**
   * 群組過濾
   * reference:
   *   https://quasar.dev/vue-components/table#qtable-api
   *   https://stackoverflow.com/a/35478115
   * @param rows
   * @param terms
   * @param cols
   * @param getCellValue
   */
  filterMethod: function(rows, terms, cols, getCellValue) {
    let escape = terms.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')

    if (escape) {
      let pattern = new RegExp(escape, "i");

      return rows.filter(x => {
        let isMatch = pattern.test(x.Topic);
        if (isMatch) return isMatch;

        (x.ETLDatas as ETLData[]).forEach(y => {
          if (!isMatch) {
            let matches = [y.ETLName, y.ErrorText, y.Category, y.Period]
              .map(word => pattern.test(word))
              .filter(r => r);

            isMatch = matches.length > 0;
          }
        });

        return isMatch;
      });
    }

    return rows;
  }
});

tableTopicGroup.displayRows = computed(() => {
  if (ddlTopic.modelValue) {
    let topics = Object.values(ddlTopic.modelValue);
    if (topics.length > 0) return tableTopicGroup.rows.filter(x => topics.includes(x.Topic));
  }

  return tableTopicGroup.rows;
});

const ddlTopic = reactive<QSelectProps>({
  modelValue: null,
  options: [],
});

function initial() {
  let url = "/ETLManager/ETLData/GetETLDatasByTopic";

  httpGetRequest<ETLDataGroup[]>(url).then((res) => {
    tableTopicGroup.rows = res;
  });

  httpGetRequest<Dictionary>("/ETLManager/Common/GetETLTopics").then((res) => {
    ddlTopic.options = Object.keys(res).map(
      (x): QSelectOption => ({ label: `${x}-${res[x]}`, value: x })
    );
  });
}

const isShowTableETLLog = ref<boolean>(false);
const tableETLLog = reactive<QTableProps>({
  rows: [],
  columns: [
    { name: "ActionName", label: t("ActionName"), field: "ActionName", align: "left", sortable: true, },
    { name: "ETLName", label: t("ETLName"), field: "ETLName", align: "left" },
    { name: "Period", label: t("Period"), field: "Period", align: "left" },
    { name: "ReturnCode", label: t("ReturnCode"), field: "ReturnCode", align: "center", },
    { name: "UsageTime", label: t("UsageTime"), field: "UsageTime", align: "center", sortable: true },
    { name: "PeriodDate", label: t("PeriodDate"), field: "PeriodDate", align: "left", format: columnFormat.fullDateTime, sortable: true, },
    { name: "ErrorText", label: t("ErrorText"), field: "ErrorText", align: "left", },
    { name: "Cdt", label: t("Cdt"), field: "Cdt", align: "left", format: columnFormat.fullDateTime, sortable: true, },
    // { name: "Level", label: t("Level"), field: "Level", align: "left", sortable: true, },
  ],
  filter: "",
});

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
    isShowTableETLLog.value = true;
  });
}
</script>

<style scoped lang="scss">
.table-topicgroup {
  & table thead th {
    z-index: 3;
  }
}
</style>
