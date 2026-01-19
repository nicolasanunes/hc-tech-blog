import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TagsService } from './tags.service';
import { ListTagsDto } from './dto/list-tags.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async listAllTags(): Promise<ListTagsDto[]> {
    return this.tagsService.listAllTags();
  }
}
