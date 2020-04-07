import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPusblishAtField1583075613692 implements MigrationInterface {
  name = 'AddPusblishAtField1583075613692';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "episode" ADD "publishedAt" TIMESTAMP WITH TIME ZONE NOT NULL`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "episode" DROP COLUMN "publishedAt"`,
      undefined,
    );
  }
}
