import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialUsers1768673242841 implements MigrationInterface {
    name = 'InitialUsers1768673242841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO users (id, name, email, password, profile_picture)
            VALUES
                (1, 'Fred Marques', 'fredmarques@email.com', '$2a$12$Yi6vPRoytJS7vyj/DtRyj.dDDbwd8fh6dqvpoKhZ/NItVpkGXvJ9q', 'https://images.unsplash.com/photo-1584999734482-0361aecad844?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
                (2, 'Carlos Henrique', 'carloshenrique@email.com', '$2a$12$Yi6vPRoytJS7vyj/DtRyj.dDDbwd8fh6dqvpoKhZ/NItVpkGXvJ9q', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1148&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
                (3, 'Carlos Eduardo', 'carloseduardo@email.com', '$2a$12$Yi6vPRoytJS7vyj/DtRyj.dDDbwd8fh6dqvpoKhZ/NItVpkGXvJ9q', 'https://images.unsplash.com/photo-1581391528803-54be77ce23e3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
                (4, 'Geovana Rocha', 'geovanarocha@email.com', '$2a$12$Yi6vPRoytJS7vyj/DtRyj.dDDbwd8fh6dqvpoKhZ/NItVpkGXvJ9q', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM users WHERE id IN (1, 2, 3, 4)
        `);
    }

}
