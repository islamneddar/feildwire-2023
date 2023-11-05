import {MigrationInterface, QueryRunner} from 'typeorm';

export class Migration1699127386189 implements MigrationInterface {
  name = 'Migration1699127386189';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "floor_plans" ADD "image_url" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "floor_plans" ADD "thumbnail_url" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "floor_plans" ADD "large_image_url" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "floor_plans" DROP COLUMN "large_image_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "floor_plans" DROP COLUMN "thumbnail_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "floor_plans" DROP COLUMN "image_url"`,
    );
  }
}
