import { Body, Post, Controller, UseGuards, Headers, Param, Get, Head } from "@nestjs/common";
import { BorrowingService } from "src/borrowing/domain/services/borrowing.service";
import { CreateBorrowingDto } from "../dto/create-borrowing.dto";
import { RolesGuard } from "src/guards/roles.guard";

@Controller('borrowing')
export class BorrowingController{
    constructor(
        private borrowingService: BorrowingService
    ){}

    @Post('add')
    @UseGuards(RolesGuard(['user']))
    async addBorrowing(@Body() createBorrowing: CreateBorrowingDto, @Headers('authorization') jwtToken: string){
        return this.borrowingService.addBorrowing(createBorrowing, jwtToken);
    }

    @Post('return/:id')
    @UseGuards(RolesGuard(['user']))
    async returnBorrowing(@Param('id') id: number){
        return this.borrowingService.returnBook(id);
    }

    @Get('my-borrowing')
    @UseGuards(RolesGuard(['user']))
    async borrowingByUserAuth(@Headers('authorization') jwtToken: string){
        return this.borrowingService.getBorrowingByUser(jwtToken);
    }

    @Get('user')
    @UseGuards(RolesGuard(['admin']))
    async borrowingByUser(){
        return this.borrowingService.GetBorrowAllUser();
    }
}