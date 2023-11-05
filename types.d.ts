import {UserEntity} from '@/domain/user/user.entity';

declare global {
  namespace Express {
    export interface Request {
      user?: UserEntity;
    }
  }
}
