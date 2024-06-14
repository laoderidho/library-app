import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "src/auth/infrastructure/entities/user.entity";
import { Book } from "src/book/infrastructure/entities/book.entity";

@Entity('borrowings')
export class Borrowing{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    bookId: number

    @Column()
    userId: number

    @Column()
    borrowingDate: Date

    @Column()
    returningDate: Date

    @Column()
    status: boolean;

    @ManyToOne(() => User, user => user.id)
    user: User;

    @ManyToOne(() => Book, book => book.id)
    book: Book;
}