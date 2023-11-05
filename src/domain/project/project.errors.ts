import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

export class ProjectNotFoundException extends NotFoundException {
  constructor() {
    super('Project not found');
  }
}

export class ProjectAlreadyExistsException extends ConflictException {
  constructor() {
    super('Project already exists');
  }
}

export class ProjectWithSameNameExistsForUserException extends ConflictException {
  constructor() {
    super('Project with same name exists for user');
  }
}

export class ProjectForbiddenDeletionWhenFloorPlanExist extends ForbiddenException {
  constructor() {
    super('Project cannot be deleted when floor plan exists');
  }
}
