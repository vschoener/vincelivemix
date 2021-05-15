import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDateFields1573508322312 implements MigrationInterface {
  public name = 'AddDateFields1573508322312';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "episode" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "episode" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "episode" DROP COLUMN "updatedAt"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "episode" DROP COLUMN "createdAt"`,
      undefined,
    );
  }
}
