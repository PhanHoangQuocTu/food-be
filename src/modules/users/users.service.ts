import { Injectable, NotFoundException } from '@nestjs/common';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from 'src/entities/user.entity';
import { IStatusResponse } from 'src/utils/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) { }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(id);

    Object.assign(user, updateUserDto);

    return await this.usersRepository.save(user);
  }

  async remove(id: number): Promise<IStatusResponse> {
    const user = await this.findOne(id);

    await this.usersRepository.remove(user)

    return {
      status: 200,
      message: 'User deleted successfully',
    };
  }
}
