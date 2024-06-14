import { JwtService } from "@nestjs/jwt";
import { CanActivate, ExecutionContext, Injectable, mixin, Type, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/auth/infrastructure/entities/user.entity";

export const RolesGuard = (roles: string[]): Type<CanActivate> => {
    @Injectable()
    class RolesGuardMixin implements CanActivate{
        constructor(
            @InjectRepository(User) 
            private userRepository: Repository<User>,
            private jwtService: JwtService
        ){}


        async canActivate(context: ExecutionContext): Promise<boolean> {
            const Request = context.switchToHttp().getRequest();
            const header = Request.headers['authorization'];


            if(!header){
                throw new UnauthorizedException('Anda Tidak Bisa Mengakses ini')
            }

            const token = header;

            if(!token){
                throw new UnauthorizedException('Anda Tidak Bisa Mengakses ini')
            }

            try {
                const decode = this.jwtService.verify(token);

                if(!decode){
                    throw new UnauthorizedException('Sesi Anda Telah Berakhir')
                }

                const user = await this.userRepository.findOne({ where: { email: decode.email }});

                if(!user){
                    throw new UnauthorizedException('User Tidak Ada')
                }

                const role = user.role;
                const hasRole = roles.includes(role);

                if(!hasRole){
                    throw new ForbiddenException('Anda Tidak Memiliki Akses')
                }

                Request.user = user;
                return true;

            } catch (error) {
                throw new UnauthorizedException(error.message)
            }

        }
    }
    return mixin(RolesGuardMixin);
}