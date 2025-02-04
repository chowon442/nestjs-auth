import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entity/book.entity';
import { DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BookDetail } from './entity/book-detail.entity';
import { Author } from 'src/author/entity/author.entity';
import { Genre } from 'src/genre/entity/genre.entity';

@Injectable()
export class BookService {
    private books: Book[] = [];
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
        @InjectRepository(BookDetail)
        private readonly bookDetailRepository: Repository<BookDetail>,
        @InjectRepository(Author)
        private readonly authorRepository: Repository<Author>,
        @InjectRepository(Genre)
        private readonly genreRepository: Repository<Genre>,
        private readonly dataSource: DataSource,
    ) {}

    async create(createBookDto: CreateBookDto) {
        const qr = this.dataSource.createQueryRunner();
        await qr.connect();
        await qr.startTransaction();

        try {
            const author = await qr.manager.findOne(Author, {
                where: { id: createBookDto.authorId },
            });
            if (!author) {
                throw new NotFoundException('존재하지 않는 ID의 작가입니다.');
            }

            const genres = await qr.manager.find(Genre, {
                where: { id: In(createBookDto.genreIds) },
            });
            if (genres.length !== createBookDto.genreIds.length) {
                throw new NotFoundException(
                    `존재하지 않는 장르가 있습니다. 존재하는 id는 ${genres.map((genre) => genre.id).join(', ')}`,
                );
            }

            const bookDetail = await qr.manager
                .createQueryBuilder()
                .insert()
                .into(BookDetail)
                .values({ detail: createBookDto.detail })
                .execute();
            const bookDetailId = bookDetail.identifiers[0].id;

            const book = await qr.manager
                .createQueryBuilder()
                .insert()
                .into(Book)
                .values({
                    title: createBookDto.title,
                    detail: {
                        id: bookDetailId,
                    },
                    author,
                })
                .execute();
            const bookId = book.identifiers[0].id;

            await qr.manager
                .createQueryBuilder()
                .relation(Book, 'genres')
                .of(bookId)
                .add(genres.map((genre) => genre.id));

            await qr.commitTransaction();

            return await this.bookRepository.findOne({
                where: { id: bookId },
                relations: ['detail', 'author', 'genres'],
            });
        } catch (e) {
            await qr.rollbackTransaction();
            throw e;
        } finally {
            await qr.release();
        }
    }

    async findAll(title?: string) {
        const qb = this.bookRepository
            .createQueryBuilder('book')
            .leftJoinAndSelect('book.author', 'author')
            .leftJoinAndSelect('book.genres', 'genres');

        if (title) {
            qb.where('book.title LIKE :title', { title: `%${title}%` });
        }

        return qb.getManyAndCount();
    }

    async findOne(id: number) {
        const book = await this.bookRepository
            .createQueryBuilder('book')
            .leftJoinAndSelect('book.detail', 'detail')
            .leftJoinAndSelect('book.author', 'author')
            .leftJoinAndSelect('book.genres', 'genres')
            .where('book.id = :id', { id })
            .getOne();

        // const book = await this.bookRepository.findOne({
        //     where: { id },
        //     relations: ['detail', 'author', 'genres'],
        // });

        if (!book) {
            // 404 에러
            throw new NotFoundException('존재하지 않는 ID의 책입니다.');
        }
        return book;
    }

    async update(id: number, updateBookDto: UpdateBookDto) {
        const qr = this.dataSource.createQueryRunner();
        await qr.connect();
        await qr.startTransaction();

        try {
            const book = await qr.manager.findOne(Book, {
                where: { id },
                relations: ['detail', 'genres'],
            });
            if (!book) {
                throw new NotFoundException('존재하지 않는 ID의 책입니다.');
            }

            const { detail, authorId, genreIds, ...bookRest } = updateBookDto;

            let newAuthor;
            if (authorId) {
                const author = await qr.manager.findOne(Author, {
                    where: { id: authorId },
                });
                if (!author) {
                    throw new NotFoundException(
                        '존재하지 않는 ID의 작가입니다.',
                    );
                }
                newAuthor = author;
            }

            let newGenres;
            if (genreIds) {
                const genres = await qr.manager.find(Genre, {
                    where: { id: In(genreIds) },
                });
                if (genres.length !== updateBookDto.genreIds.length) {
                    throw new NotFoundException(
                        `존재하지 않는 장르가 있습니다. 존재하는 id는 ${genres.map((genre) => genre.id).join(', ')}`,
                    );
                }
                newGenres = genres;
            }

            const bookUpdateFields = {
                ...bookRest,
                ...(newAuthor && { author: newAuthor }),
            };

            await qr.manager
                .createQueryBuilder()
                .update(Book)
                .set(bookUpdateFields)
                .where('id = :id', { id })
                .execute();
            // await this.bookRepository.update({ id }, bookUpdateFields);

            if (detail) {
                await qr.manager
                    .createQueryBuilder()
                    .update(BookDetail)
                    .set({ detail })
                    .where('id = :id', { id: book.detail.id })
                    .execute();
                // await this.bookDetailRepository.update(
                //     { id: book.detail.id },
                //     { detail },
                // );
            }

            if (newGenres) {
                await qr.manager
                    .createQueryBuilder()
                    .relation(Book, 'genres')
                    .of(id)
                    .addAndRemove(
                        newGenres.map((genre) => genre.id),
                        book.genres.map((genre) => genre.id),
                    );
            }

            // const newBook = await this.bookRepository.findOne({
            //     where: { id },
            //     relations: ['detail', 'author'],
            // });

            // newBook.genres = newGenres;
            // await this.bookRepository.save(newBook);

            await qr.commitTransaction();

            return this.bookRepository.findOne({
                where: { id },
                relations: ['detail', 'author', 'genres'],
            });
        } catch (e) {
            await qr.rollbackTransaction();
            throw e;
        } finally {
            await qr.release();
        }
    }

    async delete(id: number) {
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
