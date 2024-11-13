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

  async create(spacename: string): Promise<Space> {
    const Edges: Edge[] = [];
    const Nodes: Node[] = [];
    return await this.spaceRepository.save({
      name: spacename,
      edges: JSON.stringify(Edges),
      nodes: JSON.stringify(Nodes),
    });
  }

  async findAll(): Promise<Space[]> {
    return await this.spaceRepository.find();
  }

  async delete(spacename: string) {
    const space = await this.spaceRepository.findOne({
      where: { name: spacename },
    });
    if (space) {
      await this.spaceRepository.remove(space);
    }
  }
}
