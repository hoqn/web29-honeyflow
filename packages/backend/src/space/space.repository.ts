import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Space } from './space.entity';

@Injectable()
export class SpaceRepository extends Repository<Space> {
  constructor(private dataSource: DataSource) {
    super(Space, dataSource.createEntityManager());
  }

  async findByName(name: string): Promise<Space | null> {
    return await this.findOne({ where: { name } });
  }

  async deleteByName(name: string): Promise<void> {
    await this.delete({ name });
  }
}
