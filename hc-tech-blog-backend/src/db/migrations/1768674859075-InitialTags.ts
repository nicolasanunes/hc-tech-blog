import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialTags1768674859075 implements MigrationInterface {
    name = 'InitialTags1768674859075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO tags (name)
            VALUES
                ('grão direto'),
                ('tecnologia'),
                ('agronegócio'),
                ('ci/cd'),
                ('devops'),
                ('agilidade'),
                ('nosql'),
                ('banco de dados'),
                ('escalabilidade'),
                ('kubernetes'),
                ('contêineres'),
                ('orquestração'),
                ('serverless'),
                ('segurança'),
                ('cloud'),
                ('colaboração'),
                ('times distribuídos'),
                ('frontend'),
                ('frameworks'),
                ('react'),
                ('inovação')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM tags WHERE name IN (
                'grão direto', 'tecnologia', 'agronegócio', 'ci/cd', 'devops',
                'agilidade', 'nosql', 'banco de dados', 'escalabilidade', 'kubernetes',
                'contêineres', 'orquestração', 'serverless', 'segurança', 'cloud',
                'colaboração', 'times distribuídos', 'frontend', 'frameworks', 'react',
                'inovação'
            )
        `);
    }

}
