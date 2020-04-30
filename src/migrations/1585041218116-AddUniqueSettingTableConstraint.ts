import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueSettingTableConstraint1585041218116
  implements MigrationInterface {
  public name = 'AddUniqueSettingTableConstraint1585041218116';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "settings" ADD CONSTRAINT "UQ_ca7857276d2a30f4dcfa0e42cd4" UNIQUE ("name")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "settings" DROP CONSTRAINT "UQ_ca7857276d2a30f4dcfa0e42cd4"`,
      undefined,
    );
  }
}
