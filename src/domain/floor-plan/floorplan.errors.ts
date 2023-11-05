// FloorPlanWithSameNameExistsForUserException
import {BadRequestException} from '@nestjs/common';

export class FloorPlanWithSameNameExistsForUserException extends BadRequestException {
  constructor() {
    super('Floor plan with same name exists for user');
  }
}
