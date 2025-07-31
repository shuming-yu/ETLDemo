export interface Account {
  ID?: bigint;
  Login?: string;
  EmployeeId?: string;
  Type?: string;
  Name?: string;
  Descr?: string;
  Password?: string;
  Email?: string;
  Title?: string;
  Domain?: string;
  Company?: string;
  Department?: string;
  IsManager?: string;
  ManagerName?: string;
  ManagerId?: string;
  ManagerDepartment?: string;
  SurnName?: string;
  GiveName?: string;
  OfficeName?: string;
  LDAPPath?: string;
  Enable?: number;
  LastLoginTime?: Date;
  Cdt?: Date;
  Udt?: Date;
  EditorId?: bigint;
}

export interface UserProfile extends Account {
  Language?: string;
  TimeZoneId?: string;
  [x: string]: any;
}

export interface AccountSetting {
  AccountId: bigint;
  Language: string;
  TimeZoneId: string;
  Cdt?: Date;
  Udt?: Date;
}

export interface Language {
  Name: string;
  Culture: string;
  Sequence: number;
  Descr: string;
  Cdt?: Date;
  Udt?: Date;
  EditorId: bigint;
}
