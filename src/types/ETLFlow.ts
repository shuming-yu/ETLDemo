export interface ETLNode {
  NodeId: string;
  ETLName: string;
  Period: string;
  Version: string;
  Topic: string;
  X: string;
  Y: string;
  Descr: string;
  Editor?: string;
  Udt?: string;
  Cdt?: string;
  HasRelations: boolean;
}

export interface ETLNodeLinks {
  LinkId: string;   //SrcNodeId + "-" + DestNodeId;
  SrcNodeId: string;
  SrcNode?: ETLNode;
  DestNodeId: string;
  DestNode?: ETLNode;
  Level?: string;
}

export interface ETLFlow {
  Version: string;
  Topic: string;
  Nodes: ETLNode[];
  Links: ETLNodeLinks[];
}

export interface ETLNodeInfo {
  Name?: string;
  ETLName?: string;
  DataBaseName?: string;
  ExportName?: string;
	Type: string;
	Category: string;
  OwnerEmail: string;
  Descr?: string;
  Editor?: string;
  Cdt?: Date | string;
  Udt?: Date | string;

  NodeName: string;
  NodeId: string;
  Period: string;
  Topic: string;
  X: string;
  Y: string;
}