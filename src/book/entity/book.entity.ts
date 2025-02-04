import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTable } from '../../common/entity/base-table.entity';
import { BookDetail } from './book-detail.entity';
import { Author } from 'src/author/entity/author.entity';
import { Genre } from 'src/genre/entity/genre.entity';

@Entity()
export class Book extends BaseTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    title: string;

    @OneToOne(() => BookDetail, (bookDetail) => bookDetail.id, {
        cascade: true,
        nullable: false,
    })
    @JoinColumn()
    detail: BookDetail;

    @ManyToOne(() => Author, (author) => author.id, {
        cascade: true,
        nullable: false,
    })
    author: Author;

    @ManyToMany(
        () => Genre,
        genre => genre.books,
    )
    @JoinTable()
    genres: Genre[];
}
