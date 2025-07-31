import { DateTimePattern, FileExtension } from "@/types/Utils";
import type { QDialogOptions } from "quasar";
import type { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";

import { Dialog, Loading, Notify, date as quasar_date } from "quasar";

import { axiosApi } from "@/plugins/axios";
import i18n from "@/i18n/index";
import PopupDialog from "@/components/PopupDialog.vue";

//#region Models
/**
 * https://stackoverflow.com/a/13315210
 */
export interface KeyValues {
  [key: string]: string[];
}

interface DotNetError {
  errors?: KeyValues;
  Errors?: KeyValues;
}

/**
 * QTable Column Property - format
 * { name: "Cdt", label: t("Cdt"), field: "Cdt", format: columnFormat.fullDateTime },
 * reference: https://quasar.dev/vue-components/table/#qtable-api
 */
interface ColumnFormatModel {
  /**
   * 輸出完整時間格式: "YYYY/MM/DD HH:mm:ss"
   * @param val
   * @param row
   * @returns
   */
  fullDateTime: (val: string, row: any) => string;
  /**
   * 輸出日期格式: "YYYY/MM/DD"
   * @param val
   * @param row
   * @returns
   */
  date: (val: string, row: any) => string;
}
//#endregion

//#region Shared Method
let responseHandler: (response: AxiosResponse) => any = (response) => {
  Loading.hide();

  return response.data;
};

let errorHandler: (error: AxiosError<string | DotNetError>) => void = (
  error
) => {
  Loading.hide();

  showErrorNotify(parseAxiosError(error));

  throw error;
};

export function parseAxiosError(
  error: AxiosError<string | DotNetError>
): string {
  let message: string = "";
  let { response } = error;

  if (response) {
    let { data } = response;

    if (typeof data === "string") {
      message = data;
    } else {
      // ignore case
      let { errors, Errors } = data;

      [errors, Errors]
        .filter((x) => x)
        .forEach((e) => {
          if (typeof e == "object") {
            Object.keys(e).forEach((x) => {
              message += e[x].join();
            });
          }
        });
    }
  } else {
    message = `Response is emtpy. ${error.message}`;
  }

  return message;
}

export const columnFormat: ColumnFormatModel = {
  fullDateTime: function(val, row) {
    return quasar_date.formatDate(val, DateTimePattern.FULL_DATE_TIME_SLASH);
  },
  date: function(val, row) {
    return quasar_date.formatDate(val, DateTimePattern.DATE_SLASH);
  }
};

//#endregion

//#region Export Method
/**
 * 彈出確認視窗
 * @param options - QDialog參數
 * @param fnConfirm - callback, click確認按鈕後執行
 */
export function confirm(
  options: string | QDialogOptions,
  fnConfirm: () => void
): void {
  let props = {
    title: i18n.global.t("ConfirmDelete"),
    titleClass: "bg-warning text-white",
  };
  if (typeof options === "string") {
    Object.assign(props, { message: options });
  } else if (typeof options !== "undefined") {
    Object.assign(props, options);
  }

  Dialog.create({
    component: PopupDialog,
    componentProps: props,
  }).onOk(() => {
    if (typeof fnConfirm === "function") {
      fnConfirm();
    }
  });
}
/**
 * 彈出錯誤訊息視窗
 * @param options - QDialog參數
 */
export function showErrorMessage(options: string | QDialogOptions): void {
  let props = {
    title: i18n.global.t("ErrorMessage"),
    titleClass: "bg-negative text-white",
    persistent: true,
    showCancel: false,
  };

  if (typeof options === "string") {
    Object.assign(props, { message: options });
  } else if (typeof options !== "undefined") {
    Object.assign(props, options);
  }

  Dialog.create({
    component: PopupDialog,
    componentProps: props,
  });
}
/**
 * 顯示錯誤訊息
 * @param message - 顯示的內容
 */
export function showErrorNotify(message: string): void {
  Notify.create({ type: "error", message });
}
/**
 * 顯示警告訊息
 * @param message - 顯示的內容
 */
export function showWarnNotify(message: string): void {
  Notify.create({ type: "warning", message });
}
/**
 * 顯示成功訊息
 * @param message - 顯示的內容
 */
export function showSuccessNotify(message: string): void {
  Notify.create({ type: "success", message });
}
/**
 * GET Request
 * @param url
 * @param options - axios參數
 * @returns 回傳Promise
 */
export function httpGetRequest<T>(
  url: string,
  options?: AxiosRequestConfig
): Promise<T> {
  if (typeof options == "undefined") {
    options = {};
  }

  Loading.show();

  return axiosApi.get(url, options).then(responseHandler).catch(errorHandler);
}
/**
 * POST Request
 * @param url
 * @param input - body
 * @param options - axios參數
 * @returns 回傳Promise
 */
export function httpPostRequest<T>(
  url: string,
  input?: any,
  options?: AxiosRequestConfig
): Promise<T> {
  if (typeof input == "undefined") {
    input = {};
  }

  if (typeof options == "undefined") {
    options = {};
  }

  Loading.show();

  return axiosApi
    .post(url, input, options)
    .then(responseHandler)
    .catch(errorHandler);
}
/**
 * DELETE Request
 * @param url
 * @param options - axios參數
 * @returns 回傳Promise
 */
export function httpDeleteRequest<T>(
  url: string,
  options?: AxiosRequestConfig
): Promise<T> {
  if (typeof options == "undefined") {
    options = {};
  }

  Loading.show();

  return axiosApi
    .delete(url, options)
    .then(responseHandler)
    .catch(errorHandler);
}
/**
 * PUT Request
 * @param url
 * @param input - body
 * @param options - axios參數
 * @returns 回傳Promise
 */
export function httpPutRequest<T>(
  url: string,
  input?: any,
  options?: AxiosRequestConfig
): Promise<T> {
  if (typeof input == "undefined") {
    input = {};
  }

  if (typeof options == "undefined") {
    options = {};
  }

  Loading.show();

  return axiosApi
    .put(url, input, options)
    .then(responseHandler)
    .catch(errorHandler);
}
/**
 * POST Request
 * 下載Excel, Api回傳stream
 * ref: https://stackoverflow.com/a/53230807
 * @param url
 * @param input - body
 * @param fileName - 指定下載的檔案名稱
 * @param options - axios參數
 * @returns 回傳Promise
 */
export function httpDownloadExcel(
  url: string,
  input?: any,
  fileName?: string,
  options?: AxiosRequestConfig
): Promise<any> {
  if (typeof input == "undefined") {
    input = {};
  }

  if (fileName) {
    if (!fileName.endsWith(FileExtension.EXCEL)) {
      fileName += FileExtension.EXCEL;
    }
  } else if (typeof fileName == "undefined") {
    let serial = quasar_date.formatDate(
      new Date(),
      DateTimePattern.SERIAL_DATE_TIME
    );
    fileName = `${serial}${FileExtension.EXCEL}`;
  }

  if (typeof options == "undefined") {
    options = { responseType: "blob" };
  }

  Loading.show();

  return axiosApi
    .post(url, input, options)
    .then(responseHandler)
    .then((data: Blob) => {
      const href = URL.createObjectURL(data);
      const link = document.createElement("a");

      link.href = href;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    })
    .catch((error: AxiosError) => {
      Loading.hide();

      let reader = new FileReader();
      reader.onload = function () {
        showErrorNotify(reader.result as string);
      };

      reader.readAsText(error.response?.data as Blob);
      throw error;
    });
}
/**
 * POST Request
 * 下載Json, Api回傳stream
 * @param url
 * @param input - body
 * @param fileName - 指定下載的檔案名稱
 * @param options - axios參數
 * @returns 回傳Promise
 */
export function httpDownloadJson(
  url: string,
  input?: any,
  fileName?: string,
  options?: AxiosRequestConfig
): Promise<any> {
  if (typeof input == "undefined") {
    input = {};
  }

  if (fileName) {
    if (!fileName.endsWith(FileExtension.JSON)) {
      fileName += FileExtension.JSON;
    }
  } else if (typeof fileName == "undefined") {
    let serial = quasar_date.formatDate(
      new Date(),
      DateTimePattern.SERIAL_DATE_TIME
    );
    fileName = `${serial}${FileExtension.JSON}`;
  }

  if (typeof options == "undefined") {
    options = { responseType: "blob" };
  }

  Loading.show();

  return axiosApi
    .post(url, input, options)
    .then(responseHandler)
    .then((data: Blob) => {
      const href = URL.createObjectURL(data);
      const link = document.createElement("a");

      link.href = href;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    })
    .catch((error: AxiosError) => {
      Loading.hide();

      let reader = new FileReader();
      reader.onload = function () {
        showErrorNotify(reader.result as string);
      };

      reader.readAsText(error.response?.data as Blob);
      throw error;
    });
}
/**
 * POST Request
 * 匯入json
 * @param url
 * @param newTopic - Topic Name
 * @param file - json檔案
 * @param options - axios參數
 * @returns
 */
export function httpImportJsonFile<T>(
  url: string,
  newTopic: string,
  newDatabaseName: string,
  file: File,
  options?: AxiosRequestConfig
): Promise<T> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('NewTopic', newTopic);
  formData.append('NewDatabaseName', newDatabaseName);

  Loading.show();

  options = options || {};
  options.headers = { 'Content-Type': 'multipart/form-data', ...options.headers };

  return axiosApi
    .post(url, formData, options)
    .then(responseHandler)
    .catch(errorHandler);
}
//#endregion
