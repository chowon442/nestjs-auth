import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entity/book.entity';
import { BookDetail } from './entity/book-detail.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Book, BookDetail])],
    controllers: [BookController],
    providers: [BookService],
})
export class BookModule {}
