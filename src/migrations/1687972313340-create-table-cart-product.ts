import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableCartProduct1687972313340 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        CREATE TABLE IF NOT EXISTS cart_product (
          id INT NOT NULL AUTO_INCREMENT,
          cart_id INT NOT NULL,
          product_id INT NOT NULL,
          quantity INT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          FOREIGN KEY (cart_id) REFERENCES cart (id) ON DELETE CASCADE ON UPDATE CASCADE,
          FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE CASCADE ON UPDATE CASCADE
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        DROP TABLE IF EXISTS cart_product;
      `);
  }
}
