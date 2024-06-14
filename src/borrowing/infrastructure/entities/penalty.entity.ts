import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "src/auth/infrastructure/entities/user.entity";

@Entity('penalties')
export class Penalty{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userId: number

    @Column()
    penaltyStart: Date

    @Column()
    penaltyEnd: Date

    @ManyToOne(() => User, user => user.id)
    user: User;
}