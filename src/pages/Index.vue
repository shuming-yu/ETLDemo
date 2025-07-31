<template>
  <q-page class="section-background">
    <div class="column page-height no-wrap">
      <div class="col-auto">
        <div class="row q-col-gutter-sm q-ma-none">
          <div class="col-md-6 col-xs-12">
            <q-card
              class="q-pa-md no-shadow"
              style="
                width: 100%;
                max-width: 400px;
                border-radius: 1em;
                background: rgba(255, 255, 255, 0);
              "
            >
              <q-card-section class="q-py-none text-shadow text-blue-grey-10">
                <div class="text-h5 q-mt-sm q-mb-xs text-bold">
                  {{ t("Welcome") }}
                </div>
                <div class="text-h4 q-mb-xs text-bold">
                  {{ displayApplication }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <div class="col q-px-sm q-pb-sm">
        <!-- <ETLGroupByTopic></ETLGroupByTopic> -->
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

// import ETLGroupByTopic from "@/components/ETLGroupByTopic.vue";

const { t } = useI18n();
const displayApplication = ref(import.meta.env.VITE_Display_Application);

defineOptions({ name: "Index" });
</script>

<style scoped lang="scss">
.section-background {
  height: auto;
  width: 100%;
  color: #4a5759;
  background-image: url("@/assets/bg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}
</style>
