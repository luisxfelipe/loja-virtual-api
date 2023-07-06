import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableCart1687975337862 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE cart ADD COLUMN active BOOLEAN NOT NULL DEFAULT TRUE;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE cart DROP COLUMN active;
      `);
  }
}
