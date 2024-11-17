import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from './space.entity';
import { SpaceRepository } from './space.repository';
import { SnowflakeService } from 'src/common/utils/snowflake.service';

@Module({
  imports: [TypeOrmModule.forFeature([Space, SpaceRepository])],
  controllers: [SpaceController],
  providers: [SpaceService, SnowflakeService],
  exports: [SpaceService],
})
export class SpaceModule {}
