import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableOrder1688266130267 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`order\` (
          id INT NOT NULL AUTO_INCREMENT,
          user_id INT NOT NULL,
          address_id INT NOT NULL,
          date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          payment_id INT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          FOREIGN KEY (user_id) REFERENCES user(id),
          FOREIGN KEY (address_id) REFERENCES address(id),
          FOREIGN KEY (payment_id) REFERENCES payment(id)
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE order`);
  }
}
