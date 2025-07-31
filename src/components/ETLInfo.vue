<i18n src="./Resources//ETLInfo.json"></i18n>

<template>
  <q-scroll-area class="full-height">
    <q-table
      :rows="etlDataRows"
      :columns="etlDataColumns"
      row-key="name"
      hide-header
      hide-bottom
      flat
      grid
    >
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12 grid-style-transition item-container">
          <q-card bordered flat>
            <q-card-section class="q-pa-xs bg-blue-2 rounded-borders">
              <div v-if="ETLNameInfo.Name" class="text-h7" style="word-break: break-all;">{{ ETLNameInfo.Name }} {{ t("Property") }}</div>
              <div v-else class="text-h7">{{ t("TitleETLProperty") }}</div>
            </q-card-section>
            <q-list dense>
              <q-item v-for="col in props.cols" :key="col.name" class="cell-separator">
                <q-item-section>
                  <q-item-label>{{ col.label }}</q-item-label>
                  <q-item-label caption style="word-break: break-all;">{{ col.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>
    </q-table>

    <q-table
      :rows="etlPropertyRows"
      :columns="etlPropertyColumns"
      row-key="name"
      hide-header
      hide-bottom
      flat
      grid
    >
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12 grid-style-transition item-container">
          <q-card bordered flat>
            <q-card-section class="q-pa-xs bg-green-2 rounded-borders">
              <div v-if="ETLExecuteData.ETLName" class="text-h7" style="word-break: break-all;">{{ ETLExecuteData.ETLName }}-{{ ETLExecuteData.Period }} {{ t("Status") }}</div>
              <div v-else class="text-h7">{{ t("TitleETLData") }}</div>
            </q-card-section>
            <q-list dense>
              <q-item v-for="col in props.cols" :key="col.name" class="cell-separator">
                <q-item-section>
                  <q-item-label>{{ col.label }}</q-item-label>
                  <q-item-label caption style="word-break: break-all; white-space: pre-line;">{{ col.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>
    </q-table>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { date } from 'quasar'
import { useI18n } from "vue-i18n"
const { t } = useI18n();

const props = defineProps({
  ETLNameInfo: {
    type: Object, // 傳進來型別為 Object
    default: () => ({}), // 若外層無正確傳遞, 預設值回傳空物件
  },

  ETLExecuteData: {
    type: Object,
    default: () => ({}),
  }
})


const etlDataColumns = [
  { name: 'NodeId', label: t('NodeId'), field: 'NodeId' },
  { name: 'DataBaseName', label: t('DataBaseName'), field: 'DataBaseName' },
  { name: 'ExportName', label: t('ExportName'), field: 'ExportName' },
  { name: 'Type', label: t('Type'), field: 'Type' },
  { name: 'Category', label: t('Category'), field: 'Category' },
  { name: 'Period', label: t('Period'), field: 'Period' }
]
const etlDataRows = computed(() => [props.ETLNameInfo]);

const etlPropertyColumns = [
  // { name: 'ETLName', label: t('ETLName'), field: 'ETLName' },
  // { name: 'Period', label: t('Period'), field: 'Period' },
  { name: 'Before', label: t('Before'), field: 'Before', format: (val: string) => val ? date.formatDate(val, 'YYYY/MM/DD HH:mm') : '' },
  { name: 'FromPeriod', label: t('FromPeriod'), field: 'FromPeriod', format: (val: string) => val ? date.formatDate(val, 'YYYY/MM/DD HH:mm') : '' },
  { name: 'ToPeriod', label: t('ToPeriod'), field: 'ToPeriod', format: (val: string) => val ? date.formatDate(val, 'YYYY/MM/DD HH:mm') : '' },
  { name: 'After', label: t('After'), field: 'After', format: (val: string) => val ? date.formatDate(val, 'YYYY/MM/DD HH:mm') : '' },
  { name: 'UsageTime', label: t('UsageTime'), field: 'UsageTime' },
  { name: 'ReturnCode', label: t('ReturnCode'), field: 'ReturnCode' },
  { name: 'Dependence', label: t('Dependence'), field: 'Dependence' },
]
const etlPropertyRows = computed(() => [props.ETLExecuteData]);
</script>

<style scoped>
.grid-style-transition {
  transition: transform 0.28s, background-color 0.28s;
}

.item-container .cell-separator {
  border-bottom: 1px solid #e0e0e0;
}

.item-container .cell-separator:last-child {
  border-bottom: none;
}
</style>
