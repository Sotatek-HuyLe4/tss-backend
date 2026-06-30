export interface IConfigs {
  // environment
  env: string;
  port: number;

  // database
  databaseUrl: string;

  // tss
  tss: ITssNode[];

  // rpc urls
  rpcUrls: {
    evm: string;
  };
}

export interface ITssNode {
  url: string;
  listenAddress: string;
  home: string;
}
