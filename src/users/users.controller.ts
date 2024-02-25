import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { SignInDto } from './dto/sign-in.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('sign-up')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<{ user: UserEntity }> {
    return { user: await this.usersService.signUp(createUserDto) };
  }

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto): Promise<{ user: UserEntity, accessToken: string }> {
    const user = await this.usersService.signIn(signInDto)
    const accessToken = await this.usersService.accessToken(user)
    return { user, accessToken }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
