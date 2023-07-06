import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablePayment1688243003416 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        CREATE TABLE IF NOT EXISTS payment (
          id INT NOT NULL AUTO_INCREMENT,
          payment_status_id INT NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          discount DECIMAL(10, 2) NOT NULL,
          final_price DECIMAL(10, 2) NOT NULL,
          type VARCHAR(255) NOT NULL,
          amount_payments INT,
          code VARCHAR(255),
          date_payment TIMESTAMP,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          FOREIGN KEY (payment_status_id) REFERENCES payment_status(id)
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        DROP TABLE IF EXISTS payment;
      `);
  }
}
