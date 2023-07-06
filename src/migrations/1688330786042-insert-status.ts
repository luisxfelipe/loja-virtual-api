import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertStatus1688330786042 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        INSERT INTO payment_status (id, status) VALUES (1, 'Done');
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        DELETE FROM status WHERE id = 1;
      `);
  }
}
