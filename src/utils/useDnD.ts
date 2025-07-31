import { useVueFlow } from '@vue-flow/core'
import { ref, watch, type Ref } from 'vue'
import type { Node, XYPosition } from '@vue-flow/core'
import { httpGetRequest } from "@/utils/webUtil"

import { useFlowDiagramStore } from "@/stores/flowDiagram";
const flowDiagram = useFlowDiagramStore();
let tempNewNode: Node;


/** 抓取唯一 NodeId */
function getUniqueNodeId(): Promise<string> {
  let url = "ETLManager/ETLDiagram/GetUniqueNodeId";
  return httpGetRequest<string>(url)
    .then(res => {
      // console.log("GetUniqueNodeId:", res);
      return res;
    });
}

/**
 * In a real world scenario you'd want to avoid creating refs in a global scope like this as they might not be cleaned up properly.
 * @type {{draggedType: Ref<string|null>, isDragOver: Ref<boolean>, isDragging: Ref<boolean>}}
 */
const state = {
  /**
   * The type of the node being dragged.
   */
  draggedType: ref<string | null>(null),
  isDragOver: ref<boolean>(false),
  isDragging: ref<boolean>(false),
}

export default function useDragAndDrop() {
  const { draggedType, isDragOver, isDragging } = state

  const { addNodes, updateNode, removeNodes, screenToFlowCoordinate, onNodesInitialized } = useVueFlow()

  watch(isDragging, (dragging: boolean) => {
    document.body.style.userSelect = dragging ? 'none' : ''
  })

  function onDragStart(event: DragEvent, type: string, nodeLabel: string): void {
    // console.log("onDragStart-event:", event);
    flowDiagram.ETLName = nodeLabel;

    if (event.dataTransfer) {
      event.dataTransfer.setData('application/vueflow', type)
      event.dataTransfer.effectAllowed = 'move'
    }

    draggedType.value = type
    isDragging.value = true

    document.addEventListener('drop', onDragEnd)
  }

  /**
   * Handles the drag over event.
   *
   * @param {DragEvent} event
   */
  function onDragOver(...args: unknown[]): void {
    // console.log("onDragOver-event");
    const event = args[0] as DragEvent;
    event.preventDefault();

    if (draggedType.value) {
      isDragOver.value = true;

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
      }
    }
  }

  function onDragLeave(...args: unknown[]): void {
    isDragOver.value = false
  }

  function onDragEnd(): void {
    // console.log("onDragEnd-event");
    isDragging.value = false
    isDragOver.value = false
    // draggedType.value = null
    document.removeEventListener('drop', onDragEnd)
  }

  /**
   * Handles the drop event.
   *
   * @param {DragEvent} event
   */
  async function onDrop(event: DragEvent, showDialog: () => void): Promise<void> {
    // console.log("onDrop-event:", event);
    event.preventDefault();

    const position: XYPosition = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    })

    // const nodeId: string = getId()
    const nodeId: string = await getUniqueNodeId();

    const newNode: Node = {
      id: nodeId,
      type: draggedType.value as string,
      position,
      label: flowDiagram.ETLName,
      data: {
        NodeId: nodeId,
        ETLName: flowDiagram.ETLName,
        Period: "",
        Version: "",
        Topic: flowDiagram.Topic,
        X: position.x,
        Y: position.y,
        Descr: ""
      }
    }

    // flowDiagram 欄位賦值
    flowDiagram.NodeId = nodeId;
    flowDiagram.X = position.x as unknown as string;
    flowDiagram.Y = position.y as unknown as string;
    flowDiagram.Type = draggedType.value as string;


    /**
     * Align node position after drop, so it's centered to the mouse
     *
     * We can hook into events even in a callback, and we can remove the event listener after it's been called.
     */
    const { off } = onNodesInitialized(() => {
      updateNode(nodeId, (node) => ({
        position: {
          x: node.position.x - node.dimensions!.width / 2,
          y: node.position.y - node.dimensions!.height / 2,
        },
      }))

      off()
    })

    tempNewNode = newNode;
    addNodes(newNode)

    // 調用 showDialog 以顯示對話框 + 選取的 Node
    if(flowDiagram.ETLName != "END") {
      showDialog();
    }

    onDragEnd()  // Call drag end to clean up state after drop
  }


  async function onDropCancel(closeDialog: () => void): Promise<void> {
    flowDiagram.ControlDeleteNode = true;

    removeNodes(tempNewNode)

    closeDialog();

    onDragEnd()  // Call drag end to clean up state after drop
  }

  return {
    draggedType,
    isDragOver,
    isDragging,
    onDragStart,
    onDragLeave,
    onDragOver,
    onDrop,
    onDropCancel,
  }
}
