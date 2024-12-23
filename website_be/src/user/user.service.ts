import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';


@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  updateRefreshToken(id: number, refresh_token: string) {
    return this.userRepository.updateRefreshToken(id, refresh_token);
  }
  
}
