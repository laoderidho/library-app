import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from "typeorm";
import { Borrowing } from "src/borrowing/infrastructure/entities/borrowing.entity";
import { Penalty } from "src/borrowing/infrastructure/entities/penalty.entity";

// notempty orm

@Entity('users')
@Unique(['email'])
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    name: string;

    @Column()
    password: string;

    @Column()
    createdAt: Date;

    @Column({ default: 'member'})
    role: string;

    @OneToMany(() => Borrowing, borrowing => borrowing.user)
    borrowings: Borrowing[];

    @OneToMany(() => Penalty, penalty => penalty.user)
    penalties: Penalty[];
}
