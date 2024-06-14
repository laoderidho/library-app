import { Module } from '@nestjs/common';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { BorrowingModule } from './borrowing/borrowing.module';
import { MemberModule } from './member/member.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    BookModule,
    BorrowingModule,
    MemberModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
