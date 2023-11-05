import {MigrationInterface, QueryRunner} from 'typeorm';

export class Migration1699125708950 implements MigrationInterface {
  name = 'Migration1699125708950';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "soft_delete" boolean NOT NULL DEFAULT false, "user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "projects" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "soft_delete" boolean NOT NULL DEFAULT false, "project_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "user_id" uuid, CONSTRAINT "PK_b3613537a59b41f5811258edf99" PRIMARY KEY ("project_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "floor_plans" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "soft_delete" boolean NOT NULL DEFAULT false, "floor_plan_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "project_id" uuid NOT NULL, CONSTRAINT "REL_ae7e4e79d0343e472a11e16db1" UNIQUE ("project_id"), CONSTRAINT "PK_c6e977726c2a52196b82a3c6ea2" PRIMARY KEY ("floor_plan_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD CONSTRAINT "FK_bd55b203eb9f92b0c8390380010" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "projects" DROP CONSTRAINT "FK_bd55b203eb9f92b0c8390380010"`,
    );
    await queryRunner.query(`DROP TABLE "floor_plans"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
