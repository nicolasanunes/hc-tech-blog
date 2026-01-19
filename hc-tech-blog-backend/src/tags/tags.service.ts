import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { ListTagsDto } from './dto/list-tags.dto';
import { CreateTagDto } from './dto/create-tag.dto';

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

  async createTag(createTagDto: CreateTagDto): Promise<ListTagsDto> {
    // Verifica se já existe uma tag com o mesmo nome
    const existingTag = await this.tagRepository.findOne({
      where: { name: createTagDto.name },
    });

    if (existingTag) {
      throw new Error(`Já existe uma tag com o nome "${createTagDto.name}"`);
    }

    const newTag = this.tagRepository.create({
      name: createTagDto.name,
    });
    const savedTag = await this.tagRepository.save(newTag);
    return {
      id: savedTag.id,
      name: savedTag.name,
    };
  }
} 
