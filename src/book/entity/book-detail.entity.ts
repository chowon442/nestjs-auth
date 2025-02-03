import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from './book.entity';

@Entity()
export class BookDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    detail: string;

    @OneToOne(() => Book, book => book.id)
    book: Book;
}
