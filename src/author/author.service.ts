import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Repository } from 'typeorm';
import { Author } from './entity/author.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthorService {
    constructor(
        @InjectRepository(Author)
        private readonly authorRepository: Repository<Author>,
    ) {}

    create(createAuthorDto: CreateAuthorDto) {
        return this.authorRepository.save(createAuthorDto);
    }

    findAll() {
        return this.authorRepository.find();
    }

    findOne(id: number) {
        return this.authorRepository.findOne({
            where: { id },
        });
    }

    async update(id: number, updateAuthorDto: UpdateAuthorDto) {
        const author = await this.authorRepository.findOne({
            where: { id },
        });

        if (!author) {
            throw new NotFoundException('존재하지 않는 ID의 작가입니다.');
        }

        await this.authorRepository.update(
            { id },
            { ...updateAuthorDto },
        )

        const newAuthor = await this.authorRepository.findOne({
            where: { id },
        });
        return newAuthor;
    }

    async remove(id: number) {
        const author = await this.authorRepository.findOne({
            where: { id },
        });

        if (!author) {
            throw new NotFoundException('존재하지 않는 ID의 작가입니다.');
        }

        await this.authorRepository.delete(id);
        return id;
    }
}
