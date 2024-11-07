import { Module } from '@nestjs/common';
import { ChaceService } from './chace.service';

@Module({
  providers: [ChaceService]
})
export class ChaceModule {}
