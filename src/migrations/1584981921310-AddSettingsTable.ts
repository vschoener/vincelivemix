import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSettingsTable1584981921310 implements MigrationInterface {
  public name = 'AddSettingsTable1584981921310';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "settings" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "values" json NOT NULL, CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "settings"`, undefined);
  }
}
