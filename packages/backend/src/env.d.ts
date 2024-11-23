/* eslint-disable import/prefer-default-export */

import * as Y from 'yjs';
declare module 'y-websocket/bin/utils' {
  export function setPersistence(
    persistence_: {
      bindState: (arg0: string, arg1: WSSharedDoc) => void;
      writeState: (arg0: string, arg1: WSSharedDoc) => Promise<any>;
      provider: any;
    } | null,
  ): void;
  export function getPersistence(): null | {
    bindState: (arg0: string, arg1: WSSharedDoc) => void;
    writeState: (arg0: string, arg1: WSSharedDoc) => Promise<any>;
  } | null;
  export function setContentInitializor(
    f: (ydoc: Y.Doc) => Promise<void>,
  ): void;
  export function setupWSConnection(
    conn: any,
    req: any,
    { docName, gc }?: any,
  ): void;
  export class WSSharedDoc {
    constructor(name: string);
    name: string;
    conns: Map<any, Set<number>>;
    awareness: awarenessProtocol.Awareness;
    whenInitialized: Promise<void>;
  }
  export const docs: Map<string, WSSharedDoc>;
  export function getYDoc(docname: string, gc?: boolean): WSSharedDoc;
}

export {};
