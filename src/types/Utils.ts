
//#region Enums
/**
 * 常數: 時間格式
 */
export enum DateTimePattern {
  DATE = "YYYY-MM-DD",
  DATE_SLASH = "YYYY/MM/DD",
  ISO = "YYYY-MM-DDTHH:mm:ss.SSSZ",
  SQL_DATE_TIME = "YYYY-MM-DDTHH:mm:ss",
  FULL_DATE_TIME = "YYYY-MM-DD HH:mm:ss",
  FULL_DATE_TIME_SLASH = "YYYY/MM/DD HH:mm:ss",
  SERIAL_DATE_TIME = "YYYYMMDDHHmmss",
}

/**
 * 常數: 副檔名
 */
export enum FileExtension {
  EXCEL = ".xlsx",
  JSON = ".json",
}

/**
 * 常數: 支援語系
 */
export enum UICulture {
  EN_US = "en-US",
  ZH_CN = "zh-CN",
  ZH_TW = "zh-TW",
}
//#endregion

export interface Dictionary {
  [prop: string]: string;
}

//#region UserAuth
export interface UserAuthProps {
  /**
   * JWT Token
   */
  AccessToken: string;
  /**
   * JWT Token過期時間
   */
  AccessTokenExpiration: string;
  /**
   * Permission
   */
  Application: string;
  /**
   * 使用者名稱
   */
  DisplayName: string;
  Domain: string;
  /**
   * mail address
   */
  Email: string;
  /**
   * api service host
   */
  Host: string;
  /**
   * 完整工號: 域\工號
   */
  Login: string;
  /**
   * 工號
   */
  Name: string;
  /**
   * 喜好語言
   */
  PreferLanguage: string;
  /**
   * 調用Refresh的參數
   */
  RefreshToken: string;
  /**
   * client ip
   */
  RemoteIP: string;
  /**
   * Permission Roles角色權限
   */
  Roles: string[];
  /**
   * RBPC AccountId
   */
  UserId: string;
  /**
   * 時區
   */
  TimeZoneId: string;

  /**
   * Permission資訊
   */
  StorePermissionList?: PermissionProps[];
}

export interface PermissionProps {
  /**
   * identity id
   */
  ID: bigint;
  /**
   * Portal Application or Subsystem Application
   */
  Application: string;
  /**
   * 節點名稱組合而成的父子階層關係, 使用"|"分隔
   */
  Type: string;
  /**
   * 節點名稱
   */
  Name: string;
  /**
   * PCode
   */
  Descr?: string;
  /**
   * tree node level: 節點階層
   */
  TargetType: "0" | "1" | "2";
  /**
   * tree node chain: 呈現節點父子階層關係, 使用"."分隔
   */
  TargetSymbol: string;
  /**
   * URL
   */
  Privilege: string;
  /**
   * 可以判斷節點是否有子階層
   */
  ConstraintDef?: "Parent" | "Child";
  PrivilegeDisplay?: string;
  /**
   * icon, 若routes.js有明確指定會優先使用指定icon
   */
  TargetDisplay?: string;
  /**
   * 建立時間
   */
  Cdt: Date | string;
  /**
   * 最後修改時間
   */
  Udt?: Date | string;
  /**
   * 編輯者
   */
  EditorId?: bigint;
  /**
   * 依語系翻譯後的Type
   */
  TranslatedType: string;
  /**
   * 依語系翻譯後的節點名稱
   */
  TranslatedName: string;
  TranslatedDescr: string;
  TranslatedPrivilegeDisplay: string;
  /**
   * 父階層的TargetSymbol
   */
  ParentTargetSymbol: string;
}
//#endregion
