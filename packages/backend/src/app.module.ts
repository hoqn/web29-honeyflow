import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContextModule } from './context/context.module';
import { ChaceModule } from './chace/chace.module';
import { ContentModule } from './content/content.module';

@Module({
  imports: [ContextModule, ChaceModule, ContentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
