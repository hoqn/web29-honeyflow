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
import { ERROR_MESSAGES } from 'src/common/constants/error.message.constants';
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
    const urlPath = await this.SpaceService.create(userId, spaceName);

    return {
      urlPath,
    };
  }

  @Version('1')
  @Get('/:urlPath')
  async getSpace(@Param('urlPath') urlPath: string) {
    const space = await this.SpaceService.findById(urlPath);
    if (!space) {
      throw new HttpException(
        ERROR_MESSAGES.SPACE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      space,
    };
  }
}
