import { IsNotEmpty, IsString } from 'class-validator';
import { SignInDto } from './sign-in.dto';

export class CreateUserDto extends SignInDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name: string;
}
