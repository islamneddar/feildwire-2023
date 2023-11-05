import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import bcrypt from 'bcrypt';
import {ConfigService} from '@nestjs/config';
import {SALT_ROUND} from '@/configs/env.constant';
import {UserEntity} from '@/domain/user/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private configService: ConfigService,
  ) {}

  async findOneByEmail(email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async createUser(params: {email: string; password: string}) {
    const user = new UserEntity();
    user.email = params.email;
    user.password = await bcrypt.hash(
      params.password,
      Number(this.configService.getOrThrow(SALT_ROUND)),
    );
    await this.userRepository.save(user);
  }

  findOneById(id: string) {
    return this.userRepository.findOne({
      where: {
        userId: id,
      },
    });
  }

  async findOneByIdAndEmail(param: {id: string; email: string}) {
    return this.userRepository.findOne({
      where: {
        userId: param.id,
        email: param.email,
      },
    });
  }

  async findOneByEmailAndPassword(email: string, password: string) {
    const user = await this.findOneByEmail(email);
    if (!user) {
      return;
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return;
    }
    return user;
  }
}
