export interface IConfigs {
  // environment
  env: string;
  port: number;

  // database
  databaseUrl: string;

  // tss
  tss: ITssNode[];
}

export interface ITssNode {
  url: string;
  listenAddress: string;
  home: string;
}
