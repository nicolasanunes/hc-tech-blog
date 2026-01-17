import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Article } from '../../articles/entities/article.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('increment', { name: 'id', type: 'bigint' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 150, nullable: false, unique: true })
  name: string;

  @ManyToMany(() => Article, (article) => article.tags)
  articles: Article[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
