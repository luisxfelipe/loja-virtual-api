import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableAddress1687118704479 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      CREATE TABLE IF NOT EXISTS address (
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        number VARCHAR(255) NOT NULL,
        complement VARCHAR(255),
        cep VARCHAR(255) NOT NULL,
        city_id INT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES user(id),
        FOREIGN KEY (city_id) REFERENCES city(id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      DROP TABLE address;
    `);
  }
}
