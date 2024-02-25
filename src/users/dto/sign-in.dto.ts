import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class SignInDto {
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Email must be a valid email' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    password: string;
}
