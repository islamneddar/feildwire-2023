import {IsString} from 'class-validator';

export class CreateProjectRequest {
  @IsString()
  name: string;
}
