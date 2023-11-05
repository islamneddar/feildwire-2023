import {MigrationInterface, QueryRunner} from 'typeorm';

export class Migration1699166751858 implements MigrationInterface {
  name = 'Migration1699166751858';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "floor_plans" DROP CONSTRAINT "FK_ae7e4e79d0343e472a11e16db1b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "floor_plans" DROP CONSTRAINT "REL_ae7e4e79d0343e472a11e16db1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "floor_plans" ADD CONSTRAINT "FK_ae7e4e79d0343e472a11e16db1b" FOREIGN KEY ("project_id") REFERENCES "projects"("project_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "floor_plans" DROP CONSTRAINT "FK_ae7e4e79d0343e472a11e16db1b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "floor_plans" ADD CONSTRAINT "REL_ae7e4e79d0343e472a11e16db1" UNIQUE ("project_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "floor_plans" ADD CONSTRAINT "FK_ae7e4e79d0343e472a11e16db1b" FOREIGN KEY ("project_id") REFERENCES "projects"("project_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
