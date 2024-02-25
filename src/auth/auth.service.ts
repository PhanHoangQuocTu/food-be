import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import { sign } from 'jsonwebtoken';
import { hash, compare } from 'bcrypt'
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) { }

  async signUp(signUpDto: SignUpDto): Promise<UserEntity> {
    const userExists = await this.findUserByEmail(signUpDto.email);

    // check if user exists
    if (userExists) throw new BadRequestException('User already exists');

    // hash password, create user and save, delete password, return user
    signUpDto.password = await hash(signUpDto.password, 10)
    const user = this.usersRepository.create(signUpDto);
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

  async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async accessToken(user: UserEntity): Promise<string> {
    return sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
  }
}
