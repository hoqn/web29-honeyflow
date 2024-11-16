import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Edge } from './interface/space.edge';
import { Node } from './interface/space.node';
import { Space } from './space.entity';
import { MAX_SPACES } from 'src/common/constants/space.constants';
import { ERROR_MESSAGES } from 'src/common/constants/error.constants';

@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(Space)
    private readonly spaceRepository: Repository<Space>,
  ) {}

  generateUuid(): string {
    return uuidv4();
  }

  async create(userId: string, spaceName: string) {
    const Edges: Edge[] = [];
    const Nodes: Node[] = [];
    const userSpaceCount = await this.spaceRepository.count({
      where: { userId },
    });

    if (userSpaceCount >= MAX_SPACES) {
      throw new BadRequestException(ERROR_MESSAGES.SPACE_LIMIT_EXCEEDED);
    }
    const spaceId = this.generateUuid();
    const result = await this.spaceRepository.save({
      userId: userId,
      spaceId: spaceId,
      name: spaceName,
      edges: JSON.stringify(Edges),
      nodes: JSON.stringify(Nodes),
    });
    return result.spaceId;
  }

  async findById(spaceId: string) {
    const result = await this.spaceRepository.findOne({
      where: { spaceId },
    });
    if (!result) {
      throw new NotFoundException(ERROR_MESSAGES.SPACE_NOT_FOUND);
    }
    return result;
  }
}
