import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableOrderProduct1688266253806
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        CREATE TABLE IF NOT EXISTS order_product (
          id INT NOT NULL AUTO_INCREMENT,
          order_id INT NOT NULL,
          product_id INT NOT NULL,
          quantity INT NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          FOREIGN KEY (order_id) REFERENCES \`order\`(id),
          FOREIGN KEY (product_id) REFERENCES product(id)
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE order_product`);
  }
}
