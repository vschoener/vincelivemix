import { MigrationInterface, QueryRunner } from 'typeorm';
import { EPISODE_CONSTRAINT } from '../episodes/constants';

export class AddUniqueNumberEpisodeField1573508383694
  implements MigrationInterface {
  name = 'AddUniqueNumberEpisodeField1573508383694';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "episode" ADD CONSTRAINT "${EPISODE_CONSTRAINT}" UNIQUE ("number")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "episode" DROP CONSTRAINT "${EPISODE_CONSTRAINT}"`,
      undefined,
    );
  }
}
