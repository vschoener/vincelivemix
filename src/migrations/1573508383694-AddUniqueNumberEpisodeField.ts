import { MigrationInterface, QueryRunner } from 'typeorm';

import { EPISODE_CONSTRAINT } from '../episodes/constants';

export class AddUniqueNumberEpisodeField1573508383694
  implements MigrationInterface
{
  public name = 'AddUniqueNumberEpisodeField1573508383694';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "episode" ADD CONSTRAINT "${EPISODE_CONSTRAINT}" UNIQUE ("number")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "episode" DROP CONSTRAINT "${EPISODE_CONSTRAINT}"`,
      undefined,
    );
  }
}
