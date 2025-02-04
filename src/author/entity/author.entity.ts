import { Book } from 'src/book/entity/book.entity';
import { BaseTable } from 'src/common/entity/base-table.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Author extends BaseTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    dob: Date;

    @Column()
    nationality: string;

    @OneToMany(
        () => Book,
        book => book.author,
    )
    books: Book[];
}
