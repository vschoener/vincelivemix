import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCoverImageFieldEpisode1572959324868 implements MigrationInterface {
    name = 'AddCoverImageFieldEpisode1572959324868'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "episode" ADD "coverImage" character varying`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "episode" DROP COLUMN "coverImage"`, undefined);
    }

}
