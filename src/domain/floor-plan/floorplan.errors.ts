import {BadRequestException, NotFoundException} from '@nestjs/common';

export class FloorPlanWithSameNameExistsForUserException extends BadRequestException {
  constructor() {
    super('Floor plan with same name exists for user');
  }
}

export class FloorPlanNotFoundException extends NotFoundException {
  constructor() {
    super('Floor plan not found');
  }
}
