import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ERROR_MESSAGES } from 'src/common/constants/error.message.constants';
import { SpaceService } from 'src/space/space.service';
import { NoteService } from 'src/note/note.service';
import { parseSocketUrl } from 'src/common/utils/socket.util';
import { YSocketIO } from 'y-socket.io/dist/server';
import { Server, Socket } from 'socket.io';
import { Edge, Node } from '../../../shared/types';
import * as Y from 'yjs';

const SPACE = 'space';
const NOTE = 'note';
@WebSocketGateway(9001)
export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(YjsGateway.name);

  constructor(
    private readonly spaceService: SpaceService,
    private readonly noteService: NoteService,
  ) {}

  @WebSocketServer()
  private server: Server;

  private ysocketio: YSocketIO;

  async handleConnection(socket: Socket) {
    this.logger.log(`Client connected: ${socket.id}`);

    try {
      const url = socket.handshake?.url || '';
      const { urlType, urlId } = parseSocketUrl(url);

      if (!this.validateUrl(socket, urlType, urlId)) return;

      this.logger.log(`Parsed URL - Type: ${urlType}, ID: ${urlId}`);

      urlType === SPACE
        ? await this.initializeSpace(socket, urlId as string)
        : await this.initializeNote(socket, urlId as string);
    } catch (error) {
      this.logger.error(`Connection failed for ${socket.id}: ${error.message}`);
    }
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Client disconnected: ${socket.id}`);
  }

  private validateUrl(
    socket: Socket,
    urlType: string | null,
    urlId: string | null,
  ): boolean {
    if (!urlType || !urlId || (urlType !== 'space' && urlType !== 'note')) {
      this.sendErrorAndDisconnect(socket, ERROR_MESSAGES.SOCKET.INVALID_URL);
      return false;
    }
    return true;
  }

  private sendErrorAndDisconnect(socket: Socket, errorMessage: string) {
    this.logger.warn(errorMessage);
    socket.emit('error', { message: errorMessage });
    socket.disconnect(true);
  }

  private async initializeSpace(socket: Socket, urlId: string) {
    try {
      const space = await this.spaceService.findById(urlId);
      if (!space) {
        this.sendErrorAndDisconnect(socket, ERROR_MESSAGES.SPACE.NOT_FOUND);
        return;
      }

      this.setupYjs(socket, SPACE, urlId);
    } catch (error) {
      this.logger.error(
        `${ERROR_MESSAGES.NOTE.INITIALIZE_FAILED}: ${error.message}`,
      );
      this.sendErrorAndDisconnect(socket, ERROR_MESSAGES.SPACE.UPDATE_FAILED);
    }
  }

  private async initializeNote(socket: Socket, urlId: string) {
    try {
      const note = await this.noteService.findById(urlId);
      if (!note) {
        this.sendErrorAndDisconnect(socket, ERROR_MESSAGES.NOTE.NOT_FOUND);
        return;
      }

      this.setupYjs(socket, NOTE, urlId);
    } catch (error) {
      this.logger.error(
        `${ERROR_MESSAGES.NOTE.INITIALIZE_FAILED}: ${error.message}`,
      );
      this.sendErrorAndDisconnect(socket, ERROR_MESSAGES.NOTE.UPDATE_FAILED);
    }
  }

  private setupYjs(socket: Socket, type: string, urlId: string) {
    this.ysocketio = new YSocketIO(this.server);

    this.ysocketio.on(`${type} update`, (doc: Y.Doc) => {
      if (type === SPACE) {
        this.observeSpace(doc, urlId);
      } else if (type === NOTE) {
        this.observeNote(doc);
      }
    });
  }

  private observeSpace(doc: Y.Doc, urlId: string) {
    const nodes = doc.getMap('nodes');
    const edges = doc.getMap('edges');

    nodes.observe(() => {
      const updatedNodes = Object.values(nodes.toJSON());
      this.spaceService.updateByNodes(urlId, updatedNodes);
    });

    edges.observe(() => {
      const updatedEdges = Object.values(edges.toJSON());
      this.spaceService.updateByEdges(urlId, updatedEdges);
    });
  }

  private observeNote(doc: Y.Doc) {
    const note = doc.getXmlFragment('note');
    note.observeDeep(() => {});
  }
}
