import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConfigService } from './db/db-config.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { Tag } from './tags/entities/tag.entity';
import { Article } from './articles/entities/article.entity';
import { Comment } from './comments/entities/comment.entity';
import { ArticlesModule } from './articles/articles.module';
import { CommentsModule } from './comments/comments.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Tag, Article, Comment]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: DbConfigService,
      inject: [DbConfigService],
    }),
    AuthModule,
    UsersModule,
    ArticlesModule,
    CommentsModule,
    TagsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
