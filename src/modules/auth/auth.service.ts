import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import { sign } from 'jsonwebtoken';
import { hash, compare } from 'bcrypt'
import { SignInDto } from './dto/sign-in.dto';
import { CreateAdminAccountDto } from './dto/create-admin-account';
import { Roles } from 'src/utils/common/user-roles.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) { }

  async signUp(signUpDto: SignUpDto): Promise<UserEntity> {
    const userExists = await this.findUserByEmail(signUpDto.email);

    const phoneNumberExists = await this.findUserByPhoneNumber(signUpDto.phoneNumber)
    
    if (userExists ) throw new BadRequestException('User already exists');

    if (phoneNumberExists) throw new BadRequestException('Phone number already exists');

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

    if (!userExists) throw new BadRequestException('User does not exist');

    const matchPassword = await compare(signInDto.password, userExists.password);

    if (!matchPassword) throw new BadRequestException('Wrong password');

    delete userExists.password

    return userExists
  }

  async createAdminAccount(createAdminAccountDto: CreateAdminAccountDto): Promise<UserEntity> {
    if(createAdminAccountDto.verificationCode !== process.env.VERIFICATION_CODE) throw new BadRequestException('Wrong verification code');

    const userExists = await this.findUserByEmail(createAdminAccountDto.email);

    if (userExists) throw new BadRequestException('User already exists');

    createAdminAccountDto.password = await hash(createAdminAccountDto.password, 10)
    
    const user = this.usersRepository.create(createAdminAccountDto);
    
    user.roles = [Roles.ADMIN, Roles.USER];

    await this.usersRepository.save(user);

    delete user.password;

    return user;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findUserByPhoneNumber(phoneNumber: string): Promise<UserEntity> {
    return await this.usersRepository.findOne({ where: { phoneNumber } });
  }

  async accessToken(user: UserEntity): Promise<string> {
    return sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
  }
}
