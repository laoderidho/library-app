import { Module } from '@nestjs/common';
import { AuthController } from './aplication/controllers/auth.controller';
import { AuthService } from './domain/services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './infrastructure/entities/user.entity';
import { jwtConfig } from 'src/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports:[
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            global: true,
            secret: jwtConfig.secret,
            signOptions: { expiresIn: '3h' }
        })
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
