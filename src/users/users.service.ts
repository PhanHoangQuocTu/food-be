import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { hash, compare } from 'bcrypt'
import { SignInDto } from './dto/sign-in.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) { }

  async signUp(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userExists = await this.findUserByEmail(createUserDto.email);

    // check if user exists
    if (userExists) throw new BadRequestException('User already exists');

    // hash password, create user and save, delete password, return user
    createUserDto.password = await hash(createUserDto.password, 10)
    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);

    delete user.password;

    return user;
  }

  async signIn(signInDto: SignInDto): Promise<UserEntity> {
    const userExists = await this.usersRepository.createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email = :email', { email: signInDto.email })
      .getOne();

    // check if user exists
    if (!userExists) throw new BadRequestException('User does not exist');

    const matchPassword = await compare(signInDto.password, userExists.password);

    if (!matchPassword) throw new BadRequestException('Wrong password');

    delete userExists.password

    return userExists
  }

  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.usersRepository.findOneBy({ email });
  }

  async accessToken(user: UserEntity): Promise<string> {
    return sign({id: user.id, email: user.email}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
  }
}
