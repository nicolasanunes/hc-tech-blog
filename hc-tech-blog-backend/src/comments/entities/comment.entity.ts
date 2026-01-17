import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Article } from 'src/articles/entities/article.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('increment', { name: 'id', type: 'bigint' })
  id: number;
  
  @Column({ name: 'content', type: 'longtext', nullable: false })
  content: string;

  @Column({ name: 'author_id', type: 'bigint', nullable: false })
  authorId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ name: 'article_id', type: 'bigint', nullable: false })
  articleId: number;

  @ManyToOne(() => Article, { nullable: false })
  @JoinColumn({ name: 'article_id' })
  article: Article;
  
  @Column({ name: 'parent_comment_id', type: 'bigint', nullable: true })
  parentCommentId: number;

  @ManyToOne(() => Comment, { nullable: true })
  @JoinColumn({ name: 'parent_comment_id' })
  parentComment: Comment;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}