<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" :persistent="persistent">
    <q-card :style="`width: ${width}`">
      <q-card-section :class="titleClass" class="row justify-between q-pa-sm">
        <div class="text-h6 text-weight-bolder">{{ title }}</div>
        <q-btn icon="close" flat dense round v-close-popup></q-btn>
      </q-card-section>
      <q-separator />

      <q-card-section :class="messageClass" style="word-break: break-all; white-space: pre-line">
        {{ message }}
      </q-card-section>

      <q-card-section>
        <div class="row q-gutter-md justify-end">
          <q-btn
            v-if="showConfirm"
            :label="textConfirm"
            color="primary"
            no-caps
            @click="onOKClick"
          />
          <q-btn
            v-if="showCancel"
            :label="textCancel"
            color="red"
            outline
            no-caps
            @click="onDialogCancel"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
// https://quasar.dev/quasar-plugins/dialog#invoking-custom-component

import { toRefs } from "vue";
import i18n from "@/i18n";
import { useDialogPluginComponent } from "quasar";

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

defineOptions({ name: "PopupDialog" });

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const props = defineProps({
  title: {
    type: String,
    default: i18n.global.t("Error"),
  },
  titleClass: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    default: "",
  },
  messageClass: {
    type: String,
    default: "",
  },
  textConfirm: {
    type: String,
    default: i18n.global.t("OK"),
  },
  showConfirm: {
    type: Boolean,
    default: true,
  },
  textCancel: {
    type: String,
    default: i18n.global.t("Close"),
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: "30%",
  },
  persistent: {
    type: Boolean,
    default: false,
  },
});

let {
  title,
  titleClass,
  message,
  messageClass,
  textConfirm,
  textCancel,
  showConfirm,
  showCancel,
  width,
  persistent,
} = toRefs(props);

function onOKClick() {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  onDialogOK();
  // or with payload: onDialogOK({ ... })
  // ...and it will also hide the dialog automatically
}
</script>
