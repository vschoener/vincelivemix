import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEpisodeItunesFieldsField1583083496446
  implements MigrationInterface {
  name = 'AddEpisodeItunesFieldsField1583083496446';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "episode" ADD "audioLink" character varying`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "episode" ADD "durationAudioInSecond" integer`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "episode" ADD "itunesDuration" character varying`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "episode" ADD "itunesSummary" character varying`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "episode" ADD "itunesImageLink" character varying`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "episode" ADD "itunesKeywords" character varying`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "episode" ADD "itunesExplicit" boolean DEFAULT false`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "episode" DROP COLUMN "itunesExplicit"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "episode" DROP COLUMN "itunesKeywords"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "episode" DROP COLUMN "itunesImageLink"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "episode" DROP COLUMN "itunesSummary"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "episode" DROP COLUMN "itunesDuration"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "episode" DROP COLUMN "durationAudioInSecond"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "episode" DROP COLUMN "audioLink"`,
      undefined,
    );
  }
}
