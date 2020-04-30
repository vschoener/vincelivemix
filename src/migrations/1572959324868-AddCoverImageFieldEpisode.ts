import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCoverImageFieldEpisode1572959324868
  implements MigrationInterface {
  public name = 'AddCoverImageFieldEpisode1572959324868';

  public async up(queryRunner: QueryRunner) {
    await queryRunner.query(
      `ALTER TABLE "episode" ADD "coverImage" character varying`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.query(
      `ALTER TABLE "episode" DROP COLUMN "coverImage"`,
      undefined,
    );
  }
}
