import {ConflictException, UnauthorizedException} from '@nestjs/common';

export class UserAlreadyExistException extends ConflictException {
  constructor() {
    super('User already exist');
  }
}

export class WrongEmailOrPasswordException extends ConflictException {
  constructor() {
    super('Wrong email or password');
  }
}

export class UnauthorizedUserException extends UnauthorizedException {
  constructor() {
    super('Unauthorized user');
  }
}
