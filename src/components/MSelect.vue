<template>
  <q-select
    v-model="binding"
    :options="options"
    :label="label"
    :autofocus="autofocus"
    :bg-color="bgColor"
    :borderless="borderless"
    :clearable="clearable"
    :color="color"
    :dark="dark"
    :dense="dense"
    :disable="disable"
    :emit-value="emitValue"
    :filled="filled"
    :hide-bottom-space="hideBottomSpace"
    :input-class="inputClass"
    :input-style="inputStyle"
    :label-color="labelColor"
    :map-options="mapOptions"
    :max-values="maxValues"
    :multiple="multiple"
    :name="name"
    :outlined="outlined"
    :readonly="readonly"
    :rounded="rounded"
    :square="square"
    :tabindex="tabindex"
    @focus="onFocus"
    @blur="onBlur"
    @clear="onClear"
    @popup-show="onPopupShow"
    @popup-hide="onPopupHide"
  >
    <!-- 定義<option>呈現樣式 -->
    <template v-slot:option="{ itemProps, opt, selected, toggleOption, index }">
      <!-- 全選, 放置在最上面 -->
      <q-item
        v-if="index === 0 && multiple && showCheckedAll"
        @click="checkedAll.toggle"
        class="non-selectable"
        clickable
      >
        <q-item-section>
          <q-checkbox
            v-model="checkedAll.checked"
            :label="checkedAll.label"
            :class="{ 'justify-between': leftLabel, 'text-weight-bold': true }"
            :left-label="leftLabel"
            @update:model-value="checkedAll.toggleAll"
          />
        </q-item-section>
      </q-item>

      <q-item v-bind="itemProps">
        <q-item-section>
          <q-checkbox
            :model-value="selected"
            :label="opt?.label || opt"
            :class="{ 'justify-between': leftLabel }"
            :left-label="leftLabel"
            @update:model-value="toggleOption(opt)"
          />
        </q-item-section>
      </q-item>
    </template>

    <!-- 已選取的樣式呈現, 只顯示前兩筆 -->
    <template v-slot:selected-item="{ opt, index }">
      <template v-if="checkedEllipsis">
        <div class="col ellipsis" v-if="index < 2">
          <q-chip :ripple="false" dense>
            {{ opt?.label || opt }}
          </q-chip>
        </div>
        <div class="col text-center" v-if="index == 2">
          <span>{{ `(+${binding.length - 2} others)` }}</span>
        </div>
      </template>
      <template v-else>
        <q-chip v-if="index < 2" :ripple="false" dense>
          {{ opt?.label || opt }}
        </q-chip>
        <span v-if="index === 2">{{ `(+${binding.length - 2} others)` }}</span>
      </template>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { toRefs, reactive, watch } from "vue";
import type { QSelectProps } from "quasar";
import { useI18n } from "vue-i18n";

//#region Models
interface CheckedAllProps {
  /**
   * 顯示文字
   */
  label: string;
  /**
   * 判斷是否全選: true(全選), false(未選取), null(部分選取)
   */
  checked?: boolean | null;
  /**
   *觸發全選/反選
   */
  toggle: () => void;
  /**
   * 選取全部/取消全部選取
   */
  toggleAll: () => void;
}

interface MSelectProps extends QSelectProps {
  /**
   * q-checkbox呈現方式, 文字是否靠左
   */
  leftLabel?: boolean;
  /**
   * 控制是否顯示全選選項
   */
  showCheckedAll?: boolean;
  /**
   * 是否允許顯示多行
   */
  checkedEllipsis?: boolean;
}
//#endregion

const { t } = useI18n();
defineOptions({ name: "MSelect" });

let binding = defineModel<any>({ required: true });

/**
 * 監聽binding(已勾選), 自動判斷全選是否勾選
 */
watch(binding, (newValue) => {
  if ((newValue?.length || 0) === 0) {
    checkedAll.checked = false;
  } else if (newValue.length === options.value?.length) {
    checkedAll.checked = true;
  } else {
    checkedAll.checked = null;
  }
});

const props = withDefaults(defineProps<MSelectProps>(), {
  multiple: true,
  leftLabel: true,
  showCheckedAll: true,
  checkedEllipsis: false,
});

let {
  options,

  // label,
  // name,
  // color,
  // bgColor,
  // inputClass,
  // inputStyle,
  // labelColor,

  // borderless,
  // clearable,
  // dark,
  // dense,
  // filled,
  // outlined,
  // rounded,
  // square,

  emitValue,
  // mapOptions,
  // multiple,
  leftLabel, //q-checkbox

  // onClear,
} = toRefs(props);

let checkedAll: CheckedAllProps = reactive({
  label: t("CheckedAll"),
  checked: false,
  toggle: () => {
    checkedAll.checked = !checkedAll.checked;
    checkedAll.toggleAll();
  },
  toggleAll: () => {
    if (checkedAll.checked) {
      binding.value = options.value?.map((x) =>
        emitValue.value ? x.value : x
      );
    } else {
      binding.value = [];
    }
  },
});
</script>
