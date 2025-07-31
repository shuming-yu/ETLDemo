<template>
  <template v-if="typeof model == 'undefined'">
    <q-item dense v-for="i in [0, 1, 2]" :key="`skeleton_${i}`">
      <q-item-section avatar>
        <q-skeleton type="rect" width="24px" height="24px" />
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <q-skeleton type="text" height="1.5rem" />
        </q-item-label>
      </q-item-section>
    </q-item>
  </template>
  <q-expansion-item
    v-else-if="Array.isArray(model.children)"
    icon="sym_o_folder_open"
    expand-icon="keyboard_arrow_right"
    expanded-icon="keyboard_arrow_down"
    :label="model.TranslatedName"
    :content-inset-level="0.2"
    dense
    dense-toggle
    default-opened
  >
    <template #header="{ expanded }">
      <q-item-section avatar>
        <q-icon :name="expanded ? 'sym_o_folder_open' : 'sym_o_folder'" />
      </q-item-section>

      <q-item-section>
        <div class="text-weight-bold">{{ model.TranslatedName }}</div>
      </q-item-section>
    </template>

    <q-list>
      <template v-for="(child, i) in model.children">
        <AuthMenuItem v-model="model.children[i]"></AuthMenuItem>
      </template>
    </q-list>
  </q-expansion-item>
  <q-item
    v-else
    :to="model.Privilege"
    :active="checkIsActive(model)"
    exact
    dense
  >
    <q-item-section avatar>
      <q-icon :name="iconMapping(model.TargetDisplay)" />
    </q-item-section>

    <q-item-section>
      <q-item-label>
        {{ `${model.Descr}-${model.TranslatedName}` }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import AuthMenuItem from "@/components/AuthMenuItem.vue";

defineOptions({ name: "AuthMenuItem" });

const model = defineModel();
const $router = useRouter();

const mapping = reactive({
  "Authority.gif": "sym_o_admin_panel_settings",
  // "Authority.gif": "security",
  "Inspection.gif": "sym_o_search",
  "Maintain.gif": "sym_o_build",
  "Printer.gif": "sym_o_print",
  "Station.gif": "sym_o_search",
});

/**
 * 路由需要完全符合才active, 包含query string
 * @param permission
 */
function checkIsActive(permission) {
  let { fullPath } = $router.currentRoute.value;
  if (fullPath == permission.Privilege) return true;

  return false;
}

function iconMapping(name) {
  if (!name) return "sym_o_description";

  let icon = mapping[name];
  if (!icon) return name;

  return icon;
}
</script>
