import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";
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
}
