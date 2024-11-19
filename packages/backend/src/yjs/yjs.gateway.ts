import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';

@WebSocketGateway(9001)
export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor() {}

  @WebSocketServer()
  server: Server;

  handleConnection(connection: WebSocket, request: Request): void {
    console.log('connection start');

    const test = request.url.split('/').pop();
    if (test === '123' || test === '234') {
      ydoc.on('update', (update) => {
        saveUpdateToDatabase(docName, update);
      });
      const ydoc = setupWSConnection(connection, request, { docName: test });
    } else connection.close(1000, 'werwerwe');

    connection.addEventListener('message', (e) => {
      if (e.data instanceof ArrayBuffer) {
        const buffer = Buffer.from(e.data);
        console.log('Raw Binary Data:', buffer);
        console.log('Hex Representation:', buffer.toString('hex'));
      } else if (typeof e.data === 'string') {
        console.log('String Data:', e.data);
      } else {
        console.log('Unknown Data Type:', typeof e.data);
      }
    });
  }
  handleDisconnect(): void {
    console.log('connection end');
  }
}

function saveUpdateToDatabase(docName: string, update: Uint8Array) {
  Buffer.from(update);
}

function loadDocumentFromDatabase(docName: string): Y.Doc {
  const ydoc = new Y.Doc();
  const updates = getUpdatesFromDatabase(docName);
  updates.forEach((update) => {
    YjsGateway.applyUpdate(ydoc, update);
  });
  return ydoc;
}
