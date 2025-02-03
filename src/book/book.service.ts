import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entity/book.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BookDetail } from './entity/book-detail.entity';

@Injectable()
export class BookService {
    private books: Book[] = [];
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
        @InjectRepository(BookDetail)
        private readonly bookDetailRepository: Repository<BookDetail>,
    ) {}

    async getManyBooks(title?: string) {
        // 나중에 title 필터 기능 추가하기
        if (!title) {
            return [
                await this.bookRepository.find(),
                await this.bookRepository.count(),
            ];
        }

        return this.bookRepository.findAndCount({
            where: {
                title: Like(`%${title}%`),
            },
        });
    }

    async getBookById(id: number) {
        const book = await this.bookRepository.findOne({
            where: { id },
            relations: ['detail'],
        });

        if (!book) {
            // 404 에러
            throw new NotFoundException('존재하지 않는 ID의 책입니다.');
        }
        return book;
    }

    async createBook(createBookDto: CreateBookDto) {
        const book = await this.bookRepository.save({
            title: createBookDto.title,
            genre: createBookDto.genre,
            author: createBookDto.author,
            detail: {
                detail: createBookDto.detail
            },
        });
        return book;
    }

    async updateBook(id: number, updateBookDto: UpdateBookDto) {
        const book = await this.bookRepository.findOne({
            where: { id },
            relations: ['detail'],
        });

        if (!book) {
            throw new NotFoundException('존재하지 않는 ID의 책입니다.');
        }

        const { detail, ...bookRest } = updateBookDto;

        await this.bookRepository.update({ id }, bookRest);
        if (detail) {
            await this.bookDetailRepository.update(
                { id: book.detail.id },
                { detail }
            )
        }

        const newBook = await this.bookRepository.findOne({
            where: { id },
            relations: ['detail'],
        });
        return newBook;
    }

    async deleteBook(id: number) {
        const book = await this.bookRepository.findOne({
            where: { id },
            relations: ['detail'],
        });

        if (!book) {
            throw new NotFoundException('존재하지 않는 ID의 책입니다.');
        }

        await this.bookRepository.delete({ id });
        await this.bookDetailRepository.delete({ id: book.detail.id });

        return id;
    }
}
