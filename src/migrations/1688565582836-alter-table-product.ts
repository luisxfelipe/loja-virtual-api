import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProduct1688565582836 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE product 
        ADD COLUMN weight DECIMAL(10,2) NOT NULL,
        ADD COLUMN length INT NOT NULL,
        ADD COLUMN height INT NOT NULL,
        ADD COLUMN width INT NOT NULL,
        ADD COLUMN diameter INT NOT NULL;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE product DROP COLUMN weight;
        ALTER TABLE product DROP COLUMN length;
        ALTER TABLE product DROP COLUMN height;
        ALTER TABLE product DROP COLUMN width;
        ALTER TABLE product DROP COLUMN diameter;
      `);
  }
}
