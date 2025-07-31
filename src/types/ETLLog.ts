export interface ETLLog {
  ID: bigint;
  ETLName: string;
  Period: string;
  ActionName: string;
  Level: number;
  PeriodDate: Date;
  UsageTime: bigint;
  ReturnCode: number;
  ErrorText: string;
  Cdt: Date;
}
