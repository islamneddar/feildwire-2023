import {MigrationInterface, QueryRunner} from 'typeorm';

export class Migration1700063401580 implements MigrationInterface {
  name = 'Migration1700063401580';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "floor_plan_versions" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "floor_plan_version_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version_number" integer NOT NULL, "image_url" character varying NOT NULL, "thumbnail_url" character varying NOT NULL, "large_image_url" character varying NOT NULL, "floor_plan_id" uuid, CONSTRAINT "PK_46069f27357473c14180d37ad1c" PRIMARY KEY ("floor_plan_version_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "floor_plan_versions" ADD CONSTRAINT "FK_99a269eb9e189d998faa0921af4" FOREIGN KEY ("floor_plan_id") REFERENCES "floor_plans"("floor_plan_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "floor_plan_versions" DROP CONSTRAINT "FK_99a269eb9e189d998faa0921af4"`,
    );
    await queryRunner.query(`DROP TABLE "floor_plan_versions"`);
  }
}
