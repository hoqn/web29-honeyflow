import { Module } from '@nestjs/common';
import { YjsGateway } from './yjs.gateway';
import { SpaceModule } from 'src/space/space.module';

@Module({
  imports: [SpaceModule],
  providers: [YjsGateway],
})
export class YjsModule {}
