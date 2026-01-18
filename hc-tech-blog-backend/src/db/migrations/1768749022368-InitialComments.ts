import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialComments1768749022368 implements MigrationInterface {
  name = 'InitialComments1768749022368';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO comments (author_id, article_id, content, parent_comment_id, created_at, updated_at)
      VALUES (1, 2, 'Ótimo artigo!', NULL, NOW(), NOW())
    `);

    await queryRunner.query(`
      INSERT INTO comments (author_id, article_id, content, parent_comment_id, created_at, updated_at)
      VALUES (2, 2, 'Concordo totalmente! Uma ótima visão.', 1, NOW(), NOW())
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM comments WHERE user_id = 2 AND article_id = 2 AND content = 'Concordo totalmente! Uma ótima visão.'
    `);

    await queryRunner.query(`
      DELETE FROM comments WHERE user_id = 1 AND article_id = 2 AND content = 'Ótimo artigo!'
    `);
  }
}
