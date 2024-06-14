import { Body, Controller, Get, Post, Headers, HttpCode } from "@nestjs/common";
import { AuthService } from "src/auth/domain/services/auth.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { LoginUserDto } from "../dto/login-user.dto";

@Controller('auth')
export class AuthController{

    constructor(
        private authService: AuthService
    ){}

    @Post('register')
    async register(@Body() createUser: CreateUserDto){
        return this.authService.register(createUser);
    }

    @Post('login')
    async login(@Body() loginUser: LoginUserDto){
        return this.authService.login(loginUser);
    }

    @Get('profile')
    @HttpCode(200)
    async profile(@Headers('authorization') jwtToken: string){
        return this.authService.profile(jwtToken);
    }
}