import { Injectable } from "@nestjs/common";
import { User } from "src/auth/infrastructure/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";


@Injectable()
export class MemberService{
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    async findAll(): Promise<User[]>{
        return await this.userRepository.find({where : {role: 'user'}});
    }
}
