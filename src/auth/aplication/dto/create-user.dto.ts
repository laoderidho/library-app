import { IsEmail, IsNotEmpty, Max, Min } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    password: string;

    createdAt: Date;

    role: string;
}