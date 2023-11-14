import {IsOptional, IsString} from 'class-validator';

export class CreateFloorPlanRequest {
  @IsString()
  projectId: string;
}

export class UpdateFloorPlanRequest {
  @IsString()
  @IsOptional()
  name: string;
}
