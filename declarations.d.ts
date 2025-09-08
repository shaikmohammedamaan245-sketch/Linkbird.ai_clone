declare module "pg" {
  import { EventEmitter } from "events";

  export class Pool extends EventEmitter {
    constructor(config?: any);
    connect(): Promise<any>;
    query(queryText: string, values?: any[]): Promise<any>;
    end(): Promise<void>;
  }
}
