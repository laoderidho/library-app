import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Borrowing } from "src/borrowing/infrastructure/entities/borrowing.entity";


@Entity('books')
export class Book{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    author: string

    @Column()
    stok: number

    @OneToMany(() => Borrowing, borrowing => borrowing.book)
    borrowings: Borrowing[];
}
