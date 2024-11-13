import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Edge } from './interface/space.edge';
import { Node } from './interface/space.node';
import { Space } from './space.entity';

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

    const spaceId = this.generateUuid();
    //Todo 1명의 User는 unique한 spacename만 생성할 수 있어야한다.
    //Todo 1명의 User는 최대 MAX_SPACES개의 space를 생성할 수 있어야한다.
    //Todo 로그인이 기능이 없는 경우 UserId는 honeyflow가 유일하다.
    //Todo 위 사항은 회의를 통해 논의되어야한다.
    const result = await this.spaceRepository.save({
      userId: userId,
      spaceId: spaceId,
      name: spaceName,
      edges: JSON.stringify(Edges),
      nodes: JSON.stringify(Nodes),
    });
    return result;
  }

  async findById(spaceId: string) {
    const result = await this.spaceRepository.findOne({
      where: { spaceId },
    });
    return result;
  }
}
