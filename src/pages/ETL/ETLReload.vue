<i18n src="./Resources/ETLReload.json"></i18n>

<template>
  <q-page class="page-height">
    <div class="row q-ma-none q-col-gutter-sm fit">
      <div class="col-md-3 col-sm-5 col-xs-12 full-height">
        <div class="row q-gap-sm">
          <div class="col-12">
            <q-card>
              <q-card-section class="q-pa-none bg-blue-2 rounded-borders">
                <div class="text-h6 q-mx-sm">{{ t("TitleReloadETL") }}</div>
              </q-card-section>

              <q-card-section class="q-pa-sm">
                <q-form ref="formReloadRef">
                  <q-select
                    v-model="ddlTopic.modelValue"
                    :options="ddlTopic.options"
                    :label="t('ETLTopic')"
                    :rules="rules.required"
                    @update:model-value="getETLNameByTopic"
                    class="options-ellipsis"
                    color="blue"
                    outlined
                    emit-value
                    map-options
                    dense
                  />
                  <q-select
                    v-model="ddlETLNode.modelValue"
                    :options="ddlETLNode.options"
                    :label="t('ETLNode')"
                    :rules="rules.requiredNode"
                    class="options-ellipsis"
                    color="blue"
                    outlined
                    emit-value
                    map-options
                    dense
                  />
                  <div class="row justify-between items-center q-gap-sm">
                    <q-input
                      v-model="fromDaysToNow"
                      :label="t('FromDaysToNow')"
                      :rules="rules.requiredNumber"
                      class="col-grow"
                    />

                    <q-btn
                      :label="t('Reload')"
                      @click="onReload"
                      color="blue"
                      class="content-end"
                      icon="play_arrow"
                      no-caps
                    />
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12">
            <q-card>
              <q-card-section class="q-pa-none bg-green-2 rounded-borders">
                <div class="text-h6 q-mx-sm">{{ t("TitleExecuteETL") }}</div>
              </q-card-section>

              <q-card-section class="q-pa-sm">
                <q-form ref="formExecuteRef">
                  <q-select
                    v-model="ddlETLName.modelValue"
                    :options="ddlETLName.options"
                    :label="t('ETLName')"
                    :rules="rules.required"
                    @update:model-value="onUpdateTrigger"
                    class="options-ellipsis"
                    color="green"
                    outlined
                    emit-value
                    map-options
                    dense
                  />
                  <q-select
                    v-model="ddlPeriod.modelValue"
                    :options="ddlPeriod.options"
                    :label="t('Period')"
                    :rules="rules.required"
                    @update:model-value="onUpdateTrigger"
                    class="options-ellipsis"
                    color="green"
                    outlined
                    emit-value
                    map-options
                    dense
                  />
                  <div class="row justify-between items-center q-gap-sm">
                    <!-- <q-toggle
                      v-model="isToNowPeriod"
                      :label="t('IsToNowPeriod')"
                      color="green"
                      class="col-grow"
                    /> -->

                    <q-input
                      v-model="fieldLoadTime.modelValue"
                      :rules="rules.required"
                      :label="t('LoadTime')"
                      color="green"
                    >
                      <template v-slot:prepend>
                        <q-icon
                          name="event"
                          class="cursor-pointer"
                          color="green"
                        >
                          <q-popup-proxy
                            self="center start"
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-card>
                              <q-card-section class="row q-pa-none">
                                <q-date
                                  v-model="fieldLoadTime.modelValue"
                                  :mask="fieldLoadTime.mask"
                                  color="green"
                                  today-btn
                                >
                                  <div class="row items-center justify-end">
                                    <q-btn :label="t('Close')" color="red" v-close-popup flat />
                                  </div>
                                </q-date>
                                <div class="q-ml-sm"></div>
                                <q-time
                                  v-model="(fieldLoadTime.modelValue as string)"
                                  :mask="fieldLoadTime.mask"
                                  color="green"
                                  format24h
                                >
                                  <div class="row items-center justify-end">
                                    <q-btn :label="t('Close')" color="red" v-close-popup flat />
                                  </div>
                                </q-time>
                              </q-card-section>
                            </q-card>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>

                    <q-btn
                      :label="t('Execute')"
                      @click="onExecute"
                      color="green"
                      icon="play_arrow"
                      no-caps
                    />
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <div class="col full-height">
        <ETLDataLog
          outer-class="fit"
          :etl-names="etlNames"
          :etl-node="etlNode"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import type { ETLData, ETLLog, Dictionary } from "@/types";
import { DateTimePattern } from "@/types";
import type { QSelectProps, QSelectOption, QForm, QInputProps } from "quasar";
import { date as quasar_date } from "quasar";

import { ref, reactive, onMounted } from "vue";
import {
  httpGetRequest,
  httpPostRequest,
  showWarnNotify,
} from "@/utils/webUtil";
import { useI18n } from "vue-i18n";

import ETLDataLog from "@/components/ETLDataLog.vue";

//#region Declare Type
type QDdlNodeProp = {
  modelValue: LoaderName | null;
  options: QSelectOption<LoaderName>[];
};

type LoaderName = {
  ETLName: string;
  Period: string;
};

type ReloadOption = {
  MaxTaskCount?: number;
  FromDaysToNow?: number;
  ETLNames: string[];
  ETLPeriod: string;
};

type ExecuteOption = {
  MaxTaskCount?: number;
  ETLName: string;
  ETLPeriod: string;
  LoadTime: Date | string;
  // IsToNowPeriod?: boolean;
};

type Received = {
  Data?: ETLData;
  Logs?: ETLLog[];
};
//#endregion

const { t } = useI18n();

onMounted(() => {
  initialDdl();
  fieldLoadTime.modelValue = quasar_date.formatDate(
    new Date(),
    "YYYY-MM-DD 00:00"
  );
});

const ddlTopic = reactive<QSelectProps>({
  modelValue: "",
  options: [],
});

const ddlETLNode = reactive<QDdlNodeProp>({
  modelValue: null,
  options: [],
});

const ddlPeriod = reactive<QSelectProps>({
  modelValue: "",
  options: [],
});

const ddlETLName = reactive<QSelectProps>({
  modelValue: "",
  options: [],
});

const rules = reactive({
  required: [
    (val: string | undefined) => (val && val.length > 0) || t("FieldRequired"),
  ],
  requiredNode: [(val: LoaderName | null) => val != null || t("FieldRequired")],
  requiredNumber: [
    (val: number) => val.toString().length > 0 || t("FieldRequired"),
    (val: number) =>
      new RegExp("^[0-9]{1,}$").test(val.toString()) || t("FieldInvalidNumber"),
  ],
});

function initialDdl() {
  httpGetRequest<Dictionary>("/ETLManager/Common/GetETLTopics").then((res) => {
    ddlTopic.options = Object.keys(res).map(
      (x): QSelectOption => ({ label: `${x}-${res[x]}`, value: x })
    );
  });

  httpGetRequest<Dictionary>("/ETLManager/Common/GetETLPeriods").then((res) => {
    ddlPeriod.options = Object.keys(res).map(
      (x): QSelectOption => ({ label: `${x}-${res[x]}`, value: x })
    );
  });

  httpGetRequest<string[]>("/ETLManager/Common/GetETLNames").then((res) => {
    ddlETLName.options = res.map(
      (x): QSelectOption => ({ label: x, value: x })
    );
  });
}

const etlNames = ref<string[]>([]);
const etlNode = ref<LoaderName | null>();

/**
 * 觸發更新Grid資料, QueryETLData component參數
 * @param { string[] } names - 指定要顯示的ETLName
 * @param { LoaderName | null } [node] - optional, 指定一筆ETLName, Period並顯示該Log資訊
 */
function renderETLData(names: string[], node?: LoaderName | null) {
  if (typeof node == "undefined") {
    node = null;
  }

  etlNode.value = node;
  etlNames.value = names;
}

/**
 * 取得ETL Topic下所有節點
 */
function getETLNameByTopic() {
  let { modelValue: topic } = ddlTopic;
  let url = `/ETLManager/ETLExecute/GetETLNameByTopic?topic=${topic}`;
  httpGetRequest<LoaderName[]>(url).then((res) => {
    ddlETLNode.modelValue = null;
    ddlETLNode.options = res.map(
      (x): QSelectOption<LoaderName> => ({
        label: `(${x.Period}) ${x.ETLName}`,
        value: x,
      })
    );

    resetExecute();
    let names = ddlETLNode.options.map((x) => {
      let { ETLName } = x.value;
      return ETLName;
    });
    renderETLData(names);
  });
}

const formReloadRef = ref<QForm | null>(null);
const fromDaysToNow = ref(0);

async function onReload() {
  if (!(await formReloadRef.value?.validate())) {
    showWarnNotify(t("Failed"));
    return;
  }
  let url = "/ETLManager/ETLExecute/ReloadETL";
  let { ETLName, Period } = ddlETLNode.modelValue || {};

  if (ETLName && Period) {
    let input: ReloadOption = {
      ETLNames: [ETLName],
      ETLPeriod: Period,
      FromDaysToNow: fromDaysToNow.value,
    };
    httpPostRequest<Received[]>(url, input).then((res) => {
      // 觸發更新Grid資料
      resetExecute();
      let names = ddlETLNode.options.map((x) => {
        let { ETLName } = x.value;
        return ETLName;
      });
      renderETLData(names, ddlETLNode.modelValue);
    });
  }
}

/**
 * Execute ETL onChange, 連動更新Grid資料
 */
function onUpdateTrigger() {
  let { modelValue: ETLName } = ddlETLName;
  let { modelValue: Period } = ddlPeriod;

  if (ETLName) {
    let node: LoaderName | null = null;
    if (Period) {
      node = { ETLName, Period };
    }

    // 觸發更新Grid資料
    resetReload();
    renderETLData([ETLName], node);
  }
}

// const isToNowPeriod = ref(false);
const formExecuteRef = ref<QForm | null>(null);
const fieldLoadTime = reactive<QInputProps>({
  modelValue: "",
  mask: "YYYY-MM-DD HH:mm",
});

async function onExecute() {
  if (!(await formExecuteRef.value?.validate())) {
    showWarnNotify(t("Failed"));
    return;
  }
  let url = "/ETLManager/ETLExecute/ExecuteETL";
  let date_LoadTime = quasar_date.extractDate(
    fieldLoadTime.modelValue as string,
    fieldLoadTime.mask as string
  );

  let input: ExecuteOption = {
    ETLName: ddlETLName.modelValue,
    ETLPeriod: ddlPeriod.modelValue,
    LoadTime: quasar_date.formatDate(date_LoadTime, DateTimePattern.ISO),
  };
  httpPostRequest<Received[]>(url, input).then((res) => {
    // 觸發更新Grid資料
    onUpdateTrigger();
  });
}

/**
 * 清除Reload條件, 順序執行
 */
function resetReload() {
  new Promise((resolve) => {
    ddlTopic.modelValue = "";
    ddlETLNode.modelValue = null;
    resolve(null);
  }).then(() => {
    formReloadRef.value?.resetValidation();
  });
}

/**
 * 清除Execute條件, 順序執行
 */
function resetExecute() {
  new Promise((resolve) => {
    ddlETLName.modelValue = "";
    ddlPeriod.modelValue = "";
    resolve(null);
  }).then(() => {
    formExecuteRef.value?.resetValidation();
  });
}
</script>

<style lang="scss">
.options-ellipsis {
  & span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
