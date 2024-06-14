import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "src/auth/aplication/dto/create-user.dto";
import { User } from "src/auth/infrastructure/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from "src/auth/aplication/dto/login-user.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) 
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ) {}

    async register(createUserDto: CreateUserDto) {

        const hashedPassword = await bcrypt.hash(createUserDto.password, 13);
        const createdAt = new Date();

        try {
            const newUser = this.userRepository.create({
                ...createUserDto,
                password: hashedPassword,
                createdAt: createdAt
            });
            return await this.userRepository.save(newUser);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return {
                    message: 'Email already exists'
                };
            } else {
                throw error; // Melempar error untuk ditangani lebih lanjut
            }
        }
    }

     // lgin with jwt

    async login(loginUser: LoginUserDto): Promise<{ access_token: string } | { message: string }> {
        const { email, password } = loginUser;
        const user = await this.userRepository.findOne({ where: { email }});

        if (!user) {
            return {
                message: 'email dan kata sandi salah'
            };
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return {
                message: 'email dan kata sandi salah'
            };
        }

        const payload = { sub: user.id, email: user.email };

        return {
            access_token:  this.jwtService.sign(payload)
        };
    }

    async profile(token: string): Promise<User | { message: string }> {
        try {
            const decode = this.jwtService.verify(token)
            const user = await this.userRepository.findOne({ where: { email: decode.email } });

            if (!user) {
                throw new NotFoundException('User not found');
            }
            return user;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
