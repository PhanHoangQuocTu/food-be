import { IsNotEmpty, IsString } from 'class-validator';
import { SignInDto } from '../../auth/dto/sign-in.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends SignInDto {
    @ApiProperty({
        example: 'Phan Hoang Quoc Tu',
    })
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name: string;
}
