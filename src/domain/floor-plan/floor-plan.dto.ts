import {IsString} from 'class-validator';

export class CreateFloorPlanRequest {
  @IsString()
  projectId: string;
}
