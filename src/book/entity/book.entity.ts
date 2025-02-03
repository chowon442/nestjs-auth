import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTable } from './base-table.entity';
import { BookDetail } from './book-detail.entity';

@Entity()
export class Book extends BaseTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column()
    genre: string;

    @OneToOne(() => BookDetail, (bookDetail) => bookDetail.id, {
        cascade: true,
    })
    @JoinColumn()
    detail: BookDetail;
}
