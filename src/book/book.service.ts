import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

export interface Book {
    id: number;
    title: string;
    author: string;
    genre: string;
}

@Injectable()
export class BookService {
    private books: Book[] = [
        { id: 1, title: 'Book 1', author: 'Author 1', genre: 'Genre 1' },
        { id: 2, title: 'Book 2', author: 'Author 2', genre: 'Genre 2' },
        { id: 3, title: 'Book 3', author: 'Author 3', genre: 'Genre 3' },
    ];

    getManyBooks(title?: string) {
        if (!title) {
            return this.books;
        }

        return this.books.filter((b) => b.title.startsWith(title));
    }

    getBookById(id: number) {
        const book = this.books.find((b) => b.id === +id);
        if (!book) {
            // 404 에러
            throw new NotFoundException('존재하지 않는 ID의 책입니다.');
        }
        return book;
    }

    createBook(createBookDto: CreateBookDto) {
        const { title, author, genre } = createBookDto;

        if (!title) {
            throw new NotFoundException('책 제목을 입력해주세요.');
        }

        const newBook: Book = {
            id: this.books.length + 1,
            title,
            author,
            genre,
        };
        this.books.push(newBook);
        return newBook;
    }

    updateBook(id: number, updateBookDto: UpdateBookDto) {
        const { title } = updateBookDto;
        const book = this.books.find((b) => b.id === +id);
        if (!book) {
            // 404 에러
            throw new NotFoundException('존재하지 않는 ID의 책입니다.');
        }
        if (!title) {
            throw new NotFoundException('책 제목을 입력해주세요.');
        }
        book.title = title;
        // this.books = this.books.map((b) => (b.id === +id ? book : b));
        Object.assign(book, { title });
        return book;
    }

    deleteBook(id: number) {
        const bookIndex = this.books.findIndex((b) => b.id === +id);
        if (bookIndex === -1) {
            // 404 에러
            throw new NotFoundException('존재하지 않는 ID의 책입니다.');
        }
        this.books.splice(bookIndex, 1);
        return id;
    }
}
