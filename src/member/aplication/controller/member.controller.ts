import { Controller, Get, UseGuards } from "@nestjs/common";
import { MemberService } from "src/member/domain/services/member.service";
import { RolesGuard } from "src/guards/roles.guard";


@Controller('members')

export class MemberController{
    constructor(private readonly memberService: MemberService){}

    @UseGuards(RolesGuard(['admin']))
    @Get()
    async findAll(){
        return await this.memberService.findAll();
    }
}