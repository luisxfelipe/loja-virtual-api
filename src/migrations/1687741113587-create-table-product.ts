import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProduct1687741113587 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TABLE IF NOT EXISTS product (
              id INT NOT NULL AUTO_INCREMENT,
              name VARCHAR(255) NOT NULL,
              price DECIMAL(10,2) NOT NULL,
              image VARCHAR(255) NOT NULL,
              category_id INT NOT NULL,
              created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (id),
              FOREIGN KEY (category_id) REFERENCES category(id)
            );
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DROP TABLE IF EXISTS product;`);
  }
}
