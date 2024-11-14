import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Version,
} from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create.space.dto';
@Controller('space')
export class SpaceController {
  constructor(private readonly SpaceService: SpaceService) {}

  @Version('1')
  @Post()
  async createSpace(@Body() createSpaceDto: CreateSpaceDto) {
    const { userId, spaceName } = createSpaceDto;

    const spaceId = await this.SpaceService.create(userId, spaceName);
    if (!spaceId) {
      throw new HttpException('스페이스 생성 실패', HttpStatus.BAD_REQUEST);
    }
    return {
      spaceId,
    };
  }

  @Version('1')
  @Get('v1/:spaceId')
  async getSpace(@Param('spaceId') spaceId: string) {
    const space = await this.SpaceService.findById(spaceId);
    if (!space) {
      throw new HttpException(
        '스페이스가 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      space,
    };
  }
}
