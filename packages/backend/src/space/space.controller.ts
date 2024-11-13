import { Body, Controller, Delete, Post } from '@nestjs/common';
import { SpaceService } from './space.service';
import { RequestDto } from './dto/request.dto';
import { ResponseDto } from './dto/response.dto';

@Controller('Space')
export class SpaceController {
  constructor(private readonly SpaceService: SpaceService) {}

  @Post()
  async createSpace(@Body() requestDto: RequestDto) {
    const { spacename } = requestDto;
    return await this.SpaceService.create(spacename);
  }
  @Delete()
  async deleteSpace(@Body() requestDto: RequestDto) {
    const { spacename } = requestDto;
    return await this.SpaceService.create(spacename);
  }
}
