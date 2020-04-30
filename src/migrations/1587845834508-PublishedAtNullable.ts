import { MigrationInterface, QueryRunner } from 'typeorm';

export class PublishedAtNullable1587845834508 implements MigrationInterface {
  public name = 'PublishedAtNullable1587845834508';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "episode" ALTER COLUMN "publishedAt" DROP NOT NULL`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "episode" ALTER COLUMN "publishedAt" SET NOT NULL`,
      undefined,
    );
  }
}
