import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TagsService } from './tags.service';
import { ListTagsDto } from './dto/list-tags.dto';
import { CreateTagDto } from './dto/create-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async listAllTags(): Promise<ListTagsDto[]> {
    return this.tagsService.listAllTags();
  }

  @Post() 
  @UseGuards(AuthGuard('jwt'))
  async createTag(@Body() createTagDto: CreateTagDto): Promise<ListTagsDto> {
    return this.tagsService.createTag(createTagDto);
  } 
}  
 