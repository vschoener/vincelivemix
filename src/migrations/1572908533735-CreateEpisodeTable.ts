import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEpisodeTable1572908533735 implements MigrationInterface {
  public name = 'CreateEpisodeTable1572908533735';

  public async up(queryRunner: QueryRunner) {
    await queryRunner.query(
      `CREATE TABLE "episode" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "number" integer NOT NULL, "description" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_7258b95d6d2bf7f621845a0e143" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.query(`DROP TABLE "episode"`);
  }
}
