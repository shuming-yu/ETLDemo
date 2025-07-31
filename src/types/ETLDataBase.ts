export interface ETLDataBase {
  DataBaseName?: string;
  DataSource: string;
  UserID: string;
  Password: string;
  Descr?: string;
  Editor?: string;
  Cdt?: Date | string;
  Udt?: Date | string;
}