import type { UserAuthProps } from "@/types/Utils";

import { defineStore } from "pinia";
import i18n from "@/i18n/index.js";

export const useUserAuthStore = defineStore("userAuth", {
  state: () =>
    <UserAuthProps>{
      AccessToken: "",
      AccessTokenExpiration: "",
      Application: "",
      DisplayName: "", // 使用者名稱
      Domain: "",
      Email: "",
      Host: "",
      Login: "", // 域\工號
      Name: "", // 工號
      PreferLanguage: "",
      RefreshToken: "",
      RemoteIP: "",
      Roles: [], // 權限群組
      UserId: "", // AccountId
      TimeZoneId: "", // 時區

      StorePermissionList: [],
    },
  getters: {
    StoreLanguage: function (state: UserAuthProps): string {
      return state.PreferLanguage || import.meta.env.VITE_Default_Culture;
    },
  },
  actions: {
    setUserAuth(data: UserAuthProps): void {
      let { PreferLanguage } = data;
      if (PreferLanguage) {
        // 設定畫面語系
        i18n.global.locale.value = PreferLanguage;
      }

      Object.assign(this, data);
    },
  },
});
