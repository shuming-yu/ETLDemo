<template>
  <q-card class="bg-profile-card text-white">
    <q-card-section class="q-pa-none q-pb-sm">
      <q-list class="row">
        <q-item dense class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <q-item-section side>
            <q-avatar size="50px" class="q-mt-sm">
              <img src="@/assets/profile.svg?url" />
            </q-avatar>
          </q-item-section>
        </q-item>
        <q-item
          v-for="item in datas"
          :key="item.key"
          :class="item.css ? item.css : defaultColCss"
        >
          <q-item-section v-if="item.type === 'toggle'">
            <q-toggle
              checked-icon="check"
              unchecked-icon="clear"
              color="light-green"
              disable
              v-model="item.value"
              :label="item.key"
            />
          </q-item-section>
          <q-item-section v-else>
            <q-input
              readonly
              dark
              color="white"
              dense
              v-model="item.value"
              :label="item.key"
            />
          </q-item-section>
        </q-item>
        <slot name="content"></slot>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, toRefs, computed, onMounted } from "vue";

defineOptions({ name: "Profile" });

const props = defineProps({
  datas: {
    type: Object,
    default: () => [],
  },
  defaultColCss: {
    type: String,
    default: "col-lg-12 col-md-12 col-sm-12 col-xs-12",
  },
});

const { datas, defaultColCss } = toRefs(props);
</script>

<style scoped>
.bg-profile-card {
  background-color: #748cab;
}
</style>
