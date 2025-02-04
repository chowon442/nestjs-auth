import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entity/book.entity';
import { BookDetail } from './entity/book-detail.entity';
import { Author } from 'src/author/entity/author.entity';
import { Genre } from 'src/genre/entity/genre.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Book, BookDetail, Author, Genre])],
    controllers: [BookController],
    providers: [BookService],
})
export class BookModule {}
