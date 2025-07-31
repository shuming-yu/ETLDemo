import { defineStore } from "pinia";

export const useFlowDiagramStore = defineStore("flowDiagram", {
  state: () => ({
    NodeId: "",
    ETLName: "",
    Period: "",
    Topic: "",
    Version: "",
    X: "",
    Y: "",
    Descr: "",
    Editor: "",
    Udt: "",
    Cdt: "",

    Type: "",  //  input / default / output

    ControlDeleteNode: false  //  控制取消按鈕刪除Node
  }),
  getters: {

  },
  actions: {

  },
});
