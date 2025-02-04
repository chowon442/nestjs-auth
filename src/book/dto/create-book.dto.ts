import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Genre } from "src/genre/entity/genre.entity";

export class CreateBookDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    author: string;

    @IsNotEmpty()
    @IsString()
    detail: string;

    @IsNotEmpty()
    @IsNumber()
    authorId: number;

    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    genreIds: number[];
}