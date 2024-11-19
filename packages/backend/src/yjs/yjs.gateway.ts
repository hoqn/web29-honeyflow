import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ERROR_MESSAGES } from 'src/common/constants/error.message.constants';
import { WebsocketStatus } from 'src/common/constants/websocket.constants';
import { SpaceService } from 'src/space/space.service';
import { Server } from 'ws';
// @ts-expect-error 임시용
import { setupWSConnection } from 'y-websocket/bin/utils';
import * as Y from 'yjs';

@WebSocketGateway(9001)
export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(YjsGateway.name);
  private readonly ydocMap = new Map<string, Y.Doc>();
  constructor(private readonly spaceService: SpaceService) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(connection: WebSocket, request: Request) {
    this.logger.log('connection start');

    if (!request.url) {
      this.logger.warn('Request URL is undefined');
      connection.close(WebsocketStatus.POLICY_VIOLATION);
      return;
    }

    const spaceId = request.url.split('/').pop();
    if (!spaceId) {
      connection.close(WebsocketStatus.POLICY_VIOLATION);
      this.logger.warn(ERROR_MESSAGES.SPACE.NOT_FOUND);
      return;
    }

    const space = await this.spaceService.findById(spaceId);
    if (!space) {
      connection.close(WebsocketStatus.BAD_GATEWAY);
      this.logger.warn(ERROR_MESSAGES.SPACE.NOT_FOUND);
      return;
    }

    let ydoc = this.ydocMap.get(spaceId);
    if (!ydoc) {
      ydoc = new Y.Doc();
      this.ydocMap.set(spaceId, ydoc);
    }

    setupWSConnection(connection, request, {
      docName: space.name,
      doc: ydoc,
    });

    ydoc.on('update', (update) => {
      this.logger.log(`Update received for spaceId ${spaceId}`);
      this.handleUpdate(spaceId, update);
      this.saveYDocToDatabase(spaceId, ydoc);
    });
  }

  handleDisconnect(): void {
    console.log('connection end');
  }
  private handleUpdate(spaceId: string, update: Uint8Array) {
    this.server.clients.forEach((client) => {
      if (client.readyState == WebSocket.OPEN) {
        client.send(update);
      }
    });

    this.logger.log(`Processing update for spaceID ${spaceId}`);
  }

  private saveYDocToDatabase(spaceId: string, ydoc: Y.Doc) {
    const update = Y.encodeStateAsUpdateV2(ydoc);
    this.logger.debug(typeof update);
    this.logger.debug(update);
    //Todo
    //Database 저장 로직 추가
  }
}
