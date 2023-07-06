import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableCart1687963628408 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        CREATE TABLE IF NOT EXISTS cart (
          id INT NOT NULL AUTO_INCREMENT,
          user_id INT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          FOREIGN KEY (user_id) REFERENCES user (id)
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        DROP TABLE IF EXISTS cart;
      `);
  }
}
