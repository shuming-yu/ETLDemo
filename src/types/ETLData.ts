export interface ETLData {
  ID: number;
  ETLName: string;
  Period: string;
  Before: string;
  FromPeriod: string;
  ToPeriod: string;
  After: string;
  UsageTime: number;
  ReturnCode: number;
  ErrorText: string;

  Category: string;
  Topic: string;
  Dependence: string;
  Level: number;
}

export interface ETLDataGroup {
  Category: string;
  Topic: string;
  FromPeriod: Date;
  ToPeriod: Date;
  UsageTime: bigint;
  ReturnCode: number;
  Level: number;
  ETLDatas: ETLData[];
}
