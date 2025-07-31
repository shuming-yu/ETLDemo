<template>
  <!-- <AuthNTLM @onAuthorize="() => (isAuthorize = true)" /> -->

  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header class="section-header" elevated>
      <q-toolbar>
        <q-btn
          aria-label="Menu"
          icon="menu"
          class="q-mr-sm"
          @click="toggleLeftDrawer"
          flat
          dense
          round
        />

        <q-toolbar-title class="row items-center no-wrap q-pa-none" shrink>
          <q-avatar
            class="q-mr-sm cursor-pointer"
            @click="navigation"
          >
            <img :src="profile_url" class="bg-grey-4" />
          </q-avatar>

          <div
            v-if="$q.screen.gt.xs"
            class="text-h6 cursor-pointer"
            @click="navigation"
          >
            {{ displayApplication }}
          </div>
          <div v-if="$q.screen.gt.xs && pageTitle" class="text-h6">&#47;</div>
          <div class="text-h6">{{ pageTitle }}</div>
        </q-toolbar-title>

        <q-space />

        <div class="row items-center no-wrap q-gap-sm">
          <div class="column items-end">
            <!-- 工號 -->
            <div class="text-caption">IEC123456</div>
            <!-- 姓名 -->
            <div class="text-caption">
              <template v-if="$q.screen.gt.sm">
                余書銘
              </template>
            </div>
          </div>

          <q-btn round flat>
            <q-avatar size="26px">
              <img :src="profile_url" />
            </q-avatar>
            <q-tooltip>{{ $t("PersonalInfo") }}</q-tooltip>

            <q-menu>
              <q-list bordered dense style="min-width: 240px">
                <q-item to="/AccountSetting" exact dense>
                  <q-item-section>
                    <div class="row items-center q-gutter-sm">
                      <q-icon name="sym_o_manage_accounts" size="1.25rem" />
                      <q-item-label>{{ $t("AccountSetting") }}</q-item-label>
                    </div>
                  </q-item-section>
                </q-item>
                <q-separator />

                <!-- #region 使用者授權資訊 -->
                <template v-if="!isProd">
                  <q-item
                    clickable
                    v-close-popup
                    @click=""
                  >
                    <q-item-section>
                      <div class="row items-center q-gutter-sm">
                        <q-icon name="content_paste" size="18px"></q-icon>
                        <q-badge color="primary">
                          IEC123456
                        </q-badge>
                      </div>
                      <q-tooltip>Copy AccountId</q-tooltip>
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click=""
                  >
                    <q-item-section>
                      <div class="row items-center q-gutter-sm">
                        <q-icon name="content_paste" size="18px"></q-icon>
                        <q-badge color="primary">
                          余書銘
                        </q-badge>
                      </div>
                      <q-tooltip>Copy {{ t("EmployeeId") }}</q-tooltip>
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click=""
                  >
                    <q-item-section>
                      <div class="row items-center q-gutter-sm">
                        <q-icon name="content_paste" size="18px"></q-icon>
                        <q-badge color="primary">
                          Copy
                        </q-badge>
                      </div>
                      <q-tooltip>Copy Application</q-tooltip>
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click=""
                  >
                    <q-item-section>
                      <div class="row items-center q-gutter-sm">
                        <q-icon name="content_paste" size="18px"></q-icon>
                        <q-badge color="primary">Copy AccessToken</q-badge>
                      </div>
                      <q-tooltip>Copy AccessToken</q-tooltip>
                    </q-item-section>
                  </q-item>
                  <q-separator />
                </template>
                <!-- #endregion -->
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      overlay
      bordered
      class="bg-grey-2"
      :width="320"
    >
      <q-list>
        <q-item to="/ETL/ETLFlow/STAGE" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="sym_o_rebase_edit"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>ETL流程-STAGE</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/ETL/ETLFlow/PRD" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="sym_o_flowsheet"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>ETL流程-PRD</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import type { RouteLocationNormalizedLoaded } from "vue-router";

import { ref, onMounted } from "vue";
import { useRouter, onBeforeRouteUpdate } from "vue-router";
import { useI18n } from "vue-i18n";
import { copyToClipboard, useQuasar } from "quasar";
// import { useUserAuthStore } from "@/stores/userAuth";
import {
  httpGetRequest,
  showSuccessNotify,
  showWarnNotify,
  showErrorNotify,
} from "@/utils/webUtil";
// import AuthNTLM from "@/components/AuthNTLM.vue";
// import AuthMenu from "@/components/AuthMenu.vue";
import profile_url from "@/assets/profile.svg?url";
// import logo_cycle from "/icons/android-chrome-192x192.png";
// import logo_cycle from "/icons/favicon-32x32.png";

defineOptions({ name: "MainLayout" });

const $router = useRouter();
const { t } = useI18n();
const $q = useQuasar();
// const userAuth = useUserAuthStore();
const leftDrawerOpen = ref(false);
const isAuthorize = ref(false);
const isProd = ref(import.meta.env.PROD);
const displayApplication = ref(import.meta.env.VITE_Display_Application);
let pageTitle = ref("");

onMounted(() => {
  // 標註QAS環境
  if (import.meta.env.MODE !== "production") {
    displayApplication.value += "(QAS)";
  }
});

/**
 * 路由變更時, 重新設定Title與畫面標題
 */
onBeforeRouteUpdate((to, from) => {
  initialPage(to);
});

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

/**
 * NTLM驗證成功後觸發
 */
function onAuthMenu() {
  let route = $router.currentRoute.value;
  initialPage(route);
}

/**
 * 判斷是否有Permission權限
 * 並將畫面標題顯示在Header
 * @param {Object} route - 目標路由
 */
function initialPage(route: RouteLocationNormalizedLoaded) {
  let { meta, path, fullPath } = route;
  // let permission = userAuth.StorePermissionList?.find((x) => {
  //   return x.Privilege == fullPath;
  // });

  // if (permission) {
  //   let { TranslatedName } = permission;
  //   document.title = TranslatedName;
  //   pageTitle.value = TranslatedName;
  // } else {
  //   let isDev = meta?.dev || false;

  //   // 檢查Permission權限
  //   if (meta.requireAuth && isDev !== true) {
  //     let current = $router.currentRoute.value;
  //     if (current.path == path) {
  //       // 透過網址直接進入畫面, 跳轉至404
  //       $router.push("/ErrorNotFound");
  //     } else {
  //       let message = t("MsgAccessDeny");
  //       showErrorNotify(message);
  //       $router.push(current);
  //       return;
  //     }
  //   }

  //   // 部分畫面不需要權限
  //   document.title = displayApplication.value;
  //   pageTitle.value = "";
  // }

  let isDev = meta?.dev || false;

  // 檢查Permission權限
  if (meta.requireAuth && isDev !== true) {
    let current = $router.currentRoute.value;
    if (current.path == path) {
      // 透過網址直接進入畫面, 跳轉至404
      $router.push("/ErrorNotFound");
    } else {
      let message = t("MsgAccessDeny");
      showErrorNotify(message);
      $router.push(current);
      return;
    }
  }

  // 部分畫面不需要權限
  document.title = displayApplication.value;
  pageTitle.value = "";
}

/**
 * 複製內容
 * https://quasar.dev/quasar-utils/other-utils#copytoclipboard
 */
function onCopy(data: string) {
  copyToClipboard(data)
    .then(() => {
      let message = "copy success!";
      showSuccessNotify(message);
    })
    .catch(() => {
      let message = "copy failure!";
      showWarnNotify(message);
    });
}

/**
 * 回首頁
 */
function navigation() {
  $router.push("/");
}
</script>
