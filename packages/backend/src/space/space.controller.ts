import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  Version,
} from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create.space.dto';
import { Response } from 'express';
@Controller('space')
export class SpaceController {
  constructor(private readonly SpaceService: SpaceService) {}

  @Version('1')
  @Post()
  async createSpace(
    @Body() createSpaceDto: CreateSpaceDto,
    @Res() res: Response,
  ) {
    const { userId, spaceName } = createSpaceDto;

    if (!userId || !spaceName) {
      return res.status(400).json({ message: '필요한 정보가 누락되었습니다.' });
    }

    const space = await this.SpaceService.create(userId, spaceName);
    return res.status(201).json({ spaceId: space.spaceId });
  }

  @Version('1')
  @Get('v1/:spaceId')
  async getSpace(@Param('spaceId') spaceId: string, @Res() res: Response) {
    const space = await this.SpaceService.findById(spaceId);
    return res.status(200).json({ space });
  }
}
