import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterTableState1687121070295 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'state',
      new TableColumn({
        name: 'uf',
        type: 'varchar',
        length: '2',
        isNullable: false,
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE state
      DROP COLUMN uf;
    `);
  }
}
