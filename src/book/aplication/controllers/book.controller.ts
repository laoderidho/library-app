import { Body, Controller, Post, UseGuards, Get, Param, Put } from "@nestjs/common";
import { BookService } from "src/book/domain/services/book.service";
import { CreateBookdto } from "../dto/create-book.dto";
import { RolesGuard } from "src/guards/roles.guard";


@Controller('book')
export class BookController{
    constructor(
        private bookService: BookService
    ){}

    @Post('add')
    @UseGuards(RolesGuard(['admin']))
    async addBook(@Body() createBook: CreateBookdto){
        return this.bookService.addBook(createBook)
    }

    @Get()
    async getBook(){
        return this.bookService.getBook()
    }

    @Get(':id')
    async getBookById(@Param('id') id: number){
        return this.bookService.getBookById(id)
    }

    @Put(':id')
    @UseGuards(RolesGuard(['admin']))
    async updateBook(@Param('id') id: number, @Body() createBook: CreateBookdto){
        return this.bookService.updateBook(id, createBook)
    }
}