import { Injectable,} from "@nestjs/common";
import { CreateBookdto } from "src/book/aplication/dto/create-book.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Book } from "src/book/infrastructure/entities/book.entity";
import { Repository } from "typeorm";

@Injectable()
export class BookService{
    constructor(
        @InjectRepository(Book) private bookRepository: Repository<Book >
    ){}

    async addBook(createBook: CreateBookdto){
        try {
            await this.bookRepository.save(createBook)

            return {
                message: 'data Berhasil Di Simpan'
            }
        } catch (error) {
            return error
        }
    }

    async getBook(){
        try {
            const data = await this.bookRepository
                .createQueryBuilder('book')
                .where('book.stok > 0')
                .take(100)
                .getMany()
            return data
        } catch (error) {
            return error
        }
    }

    async getBookById(id: number){
        try {
            const data = await this.bookRepository.findOne({where: {id: id}})
            return data
        } catch (error) {
            return error
        }
    }

    async updateBook(id: number, createBook: CreateBookdto){
        try {
            await this.bookRepository.update(id, createBook)
            return {
                message: 'data berhasil di update'
            }
        } catch (error) {
            return error
        }
    }   
}