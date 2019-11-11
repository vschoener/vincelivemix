import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueNumberEpisodeField1573508383694
  implements MigrationInterface {
  name = 'AddUniqueNumberEpisodeField1573508383694';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "episode" ADD CONSTRAINT "UQ_7166afa4951d08d8d88a4304e65" UNIQUE ("number")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "episode" DROP CONSTRAINT "UQ_7166afa4951d08d8d88a4304e65"`,
      undefined,
    );
  }
}
