export interface IDatabaseOptions {
  db_name: string;
  isJson?: boolean;
  memoryCache?: boolean;
}

export interface ISearch {
  [key: string]: any;
  _: { key: string; status?: boolean };
}
