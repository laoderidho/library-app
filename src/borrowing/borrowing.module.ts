import { Module } from '@nestjs/common';
import { BorrowingService } from './domain/services/borrowing.service';
import { BorrowingController } from './aplication/controllers/borrowing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrowing } from './infrastructure/entities/borrowing.entity';
import { User } from 'src/auth/infrastructure/entities/user.entity';
import { Book } from 'src/book/infrastructure/entities/book.entity';
import { Penalty } from './infrastructure/entities/penalty.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Borrowing]),
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([Book]),
        TypeOrmModule.forFeature([Penalty]),
    ],
    controllers: [BorrowingController],
    providers: [BorrowingService],
})
export class BorrowingModule {}
