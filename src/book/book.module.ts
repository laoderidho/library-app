import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './infrastructure/entities/book.entity';
import { BookController } from './aplication/controllers/book.controller';
import { BookService } from './domain/services/book.service';
import { AuthMiddleware } from 'src/middleware/auth.middleware';
import { User } from 'src/auth/infrastructure/entities/user.entity';

@Module({
    imports:[
        TypeOrmModule.forFeature([Book]),
        TypeOrmModule.forFeature([User])
    ],
    controllers: [BookController],
    providers: [BookService]
})
export class BookModule {
    configure(consumer: MiddlewareConsumer){
        consumer
            .apply(AuthMiddleware)
            .forRoutes({path: 'book/*', method: RequestMethod.ALL})
    }
}
