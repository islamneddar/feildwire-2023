import {IsEmail, IsString, Matches, MinLength} from 'class-validator';

export class SignupRequest {
  @IsEmail({}, {message: 'Invalid email'})
  email: string;

  @IsString()
  @MinLength(8, {message: 'Password must be at least 4 characters'})
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one digit',
  })
  password: string;
}

export class LoginRequest {
  @IsEmail({}, {message: 'Invalid email'})
  email: string;

  @IsString()
  @MinLength(4)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one digit',
  })
  password: string;
}
