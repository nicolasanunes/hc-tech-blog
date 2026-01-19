import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { ListTagsDto } from './dto/list-tags.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async listAllTags(): Promise<ListTagsDto[]> {
    const tags = await this.tagRepository.find({
      order: { name: 'ASC' },
    });

    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
    }));
  }
} 
