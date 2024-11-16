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
import { GUEST_USER_ID } from 'src/common/constants/space.constants';
import { ERROR_MESSAGES } from 'src/common/constants/error.constants';
@Controller('space')
export class SpaceController {
  constructor(private readonly SpaceService: SpaceService) {}

  @Version('1')
  @Post()
  async createSpace(@Body() createSpaceDto: CreateSpaceDto) {
    const { userId, spaceName } = createSpaceDto;
    if (userId !== GUEST_USER_ID || !spaceName) {
      throw new HttpException(
        ERROR_MESSAGES.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }
    const spaceId = await this.SpaceService.create(userId, spaceName);

    if (!spaceId) {
      throw new HttpException(
        ERROR_MESSAGES.SPACE_CREATION_FAILED,
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      spaceId,
    };
  }

  @Version('1')
  @Get('/:spaceId')
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
