import {MigrationInterface, QueryRunner} from 'typeorm';

export class Migration1699149426518 implements MigrationInterface {
  name = 'Migration1699149426518';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "floor_plans" DROP COLUMN "soft_delete"`,
    );
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "soft_delete"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "soft_delete"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "soft_delete" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD "soft_delete" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "floor_plans" ADD "soft_delete" boolean NOT NULL DEFAULT false`,
    );
  }
}
