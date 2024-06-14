import { Module } from '@nestjs/common';
import { User } from 'src/auth/infrastructure/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberController } from './aplication/controller/member.controller';
import { MemberService } from './domain/services/member.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [MemberController],
    providers: [MemberService],
})
export class MemberModule {}
