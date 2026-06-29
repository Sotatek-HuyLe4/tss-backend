export interface IConfigs {
  // environment
  env: string;
  port: number;

  // database
  databaseUrl: string;

  // tss
  tss: {
    node1Url: string;
    node2Url: string;
    node3Url: string;
  };
}
