import { Book } from "src/book/entity/book.entity";
import { BaseTable } from "src/common/entity/base-table.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Genre extends BaseTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    name: string;

    @ManyToMany(
        () => Book,
        book => book.genres
    )
    books: Book[];
}